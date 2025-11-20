import { useState, useEffect, useCallback } from 'react';
import { UserGoal, NutritionInfo } from '../types';
import {
  getActiveGoal,
  calculateProgress,
  checkDailyGoalAchievement,
} from '../services/goalService';
import { getMealsByDateRange } from '../services/mealService';

interface GoalProgressData {
  goal: UserGoal | null;
  progressPercentage: number;
  daysElapsed: number;
  daysRemaining: number;
  isOnTrack: boolean;
  todayAchieved: boolean;
  consecutiveDays: number;
  averageDailyCalories: number;
}

/**
 * 自定义Hook：管理目标进度
 * 提供目标进度计算和追踪功能
 */
export function useGoalProgress() {
  const [data, setData] = useState<GoalProgressData>({
    goal: null,
    progressPercentage: 0,
    daysElapsed: 0,
    daysRemaining: 0,
    isOnTrack: false,
    todayAchieved: false,
    consecutiveDays: 0,
    averageDailyCalories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 计算进度数据
  const calculateProgressData = useCallback((goal: UserGoal): GoalProgressData => {
    const progress = calculateProgress(goal);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // 获取今天的餐次
    const todayMeals = getMealsByDateRange(todayStart, todayEnd);
    const todayCalories = todayMeals.reduce((sum, meal) => {
      return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
    }, 0);

    // 计算今天的营养摄入
    const todayNutrition: NutritionInfo = todayMeals.reduce(
      (total, meal) => {
        meal.foods.forEach((food) => {
          total.protein += food.nutrition.protein;
          total.fat += food.nutrition.fat;
          total.carbs += food.nutrition.carbs;
          total.fiber += food.nutrition.fiber;
        });
        return total;
      },
      { protein: 0, fat: 0, carbs: 0, fiber: 0 }
    );

    // 检查今天是否达标
    const achievement = checkDailyGoalAchievement(goal, todayCalories, todayNutrition);
    const todayAchieved = achievement.overallAchieved;

    // 计算连续达标天数（简化版本）
    let consecutiveDays = 0;
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayMeals = getMealsByDateRange(dayStart, dayEnd);
      const dayCalories = dayMeals.reduce((sum, meal) => {
        return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
      }, 0);

      const dayNutrition: NutritionInfo = dayMeals.reduce(
        (total, meal) => {
          meal.foods.forEach((food) => {
            total.protein += food.nutrition.protein;
            total.fat += food.nutrition.fat;
            total.carbs += food.nutrition.carbs;
            total.fiber += food.nutrition.fiber;
          });
          return total;
        },
        { protein: 0, fat: 0, carbs: 0, fiber: 0 }
      );

      const dayAchievement = checkDailyGoalAchievement(goal, dayCalories, dayNutrition);
      if (dayAchievement.overallAchieved) {
        consecutiveDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 计算平均每日卡路里
    const startDate = new Date(goal.startDate);
    const endDate = goal.status === 'completed' ? new Date(goal.targetDate) : today;
    const allMeals = getMealsByDateRange(startDate, endDate);
    const totalCalories = allMeals.reduce((sum, meal) => {
      return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
    }, 0);
    const daysPassed = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const averageDailyCalories = Math.round(totalCalories / daysPassed);

    // 判断是否按计划进行
    const expectedProgress = (progress / 100) * 100;
    const isOnTrack = progress >= expectedProgress * 0.9; // 允许10%的偏差

    return {
      goal,
      progressPercentage: progress,
      daysElapsed: Math.ceil(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ),
      daysRemaining: Math.max(
        0,
        Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      ),
      isOnTrack,
      todayAchieved,
      consecutiveDays,
      averageDailyCalories,
    };
  }, []);

  // 加载目标进度
  const loadProgress = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const activeGoal = getActiveGoal();

      if (activeGoal) {
        const progressData = calculateProgressData(activeGoal);
        setData(progressData);
      } else {
        setData({
          goal: null,
          progressPercentage: 0,
          daysElapsed: 0,
          daysRemaining: 0,
          isOnTrack: false,
          todayAchieved: false,
          consecutiveDays: 0,
          averageDailyCalories: 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载目标进度失败');
      console.error('Failed to load goal progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [calculateProgressData]);

  // 刷新进度
  const refresh = useCallback(() => {
    loadProgress();
  }, [loadProgress]);

  // 自动加载
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    ...data,
    isLoading,
    error,
    refresh,
  };
}
