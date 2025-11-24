import React, { useState, useEffect } from 'react';
import { UserGoal, GoalType } from '../../types';
import {
  checkDailyGoalAchievement,
  calculateConsecutiveDays,
  pauseGoal,
  resumeGoal,
} from '../../services/goalService';
import { getMealsByDateRange } from '../../services/mealService';
import './GoalCard.css';

interface GoalCardProps {
  goal: UserGoal;
  onEdit?: () => void;
  onStatusChange?: () => void;
}

/**
 * 目标卡片组件
 * 显示目标概览、每日达成情况、营养素对比、连续达标徽章
 */
const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onStatusChange }) => {
  const [dailyAchievement, setDailyAchievement] = useState({
    caloriesAchieved: false,
    proteinAchieved: false,
    fatAchieved: false,
    carbsAchieved: false,
    fiberAchieved: false,
    overallAchieved: false,
  });
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [todayIntake, setTodayIntake] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // 获取今日摄入数据
  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const meals = await getMealsByDateRange(today, endOfDay);

      const totalCalories = meals.reduce((sum, meal) => {
        return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
      }, 0);

      const totalNutrition = meals.reduce(
        (total, meal) => ({
          protein: total.protein + meal.totalNutrition.protein,
          fat: total.fat + meal.totalNutrition.fat,
          carbs: total.carbs + meal.totalNutrition.carbs,
          fiber: total.fiber + meal.totalNutrition.fiber,
        }),
        { protein: 0, fat: 0, carbs: 0, fiber: 0 }
      );

      setTodayIntake({
        calories: totalCalories,
        ...totalNutrition,
      });

      const achievement = await checkDailyGoalAchievement(goal);
      setDailyAchievement(achievement);
      
      const consecutive = await calculateConsecutiveDays(goal);
      setConsecutiveDays(consecutive);
    };

    loadData();
  }, [goal]);

  // 获取目标类型信息
  const getGoalTypeInfo = () => {
    switch (goal.type) {
      case GoalType.WEIGHT_LOSS:
        return { icon: '📉', label: '减重', color: '#3b82f6' };
      case GoalType.MUSCLE_GAIN:
        return { icon: '💪', label: '增肌', color: '#8b5cf6' };
      case GoalType.MAINTAIN:
        return { icon: '⚖️', label: '维持', color: '#10b981' };
      case GoalType.HEALTH:
        return { icon: '🌟', label: '健康', color: '#f59e0b' };
      default:
        return { icon: '🎯', label: '目标', color: '#6b7280' };
    }
  };

  const goalTypeInfo = getGoalTypeInfo();

  // 计算营养素达成百分比
  const calculateNutrientPercentage = (actual: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((actual / target) * 100), 150); // 最多显示150%
  };

  // 处理暂停/恢复
  const handleTogglePause = async () => {
    setIsProcessing(true);
    try {
      if (goal.status === 'active') {
        await pauseGoal(goal.id);
      } else if (goal.status === 'paused') {
        await resumeGoal(goal.id);
      }
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Failed to toggle goal status:', error);
      alert(error instanceof Error ? error.message : '操作失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`goal-card ${goal.status}`}>
      {/* 卡片头部 */}
      <div className="goal-card-header">
        <div className="goal-type-badge" style={{ background: goalTypeInfo.color }}>
          <span className="type-icon">{goalTypeInfo.icon}</span>
          <span className="type-label">{goalTypeInfo.label}</span>
        </div>
        <div className="goal-actions">
          {onEdit && (
            <button
              className="action-btn edit-btn"
              onClick={onEdit}
              title="编辑目标"
              disabled={isProcessing}
            >
              ✏️
            </button>
          )}
          <button
            className="action-btn pause-btn"
            onClick={handleTogglePause}
            title={goal.status === 'active' ? '暂停目标' : '恢复目标'}
            disabled={isProcessing}
          >
            {goal.status === 'active' ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      {/* 目标概览 */}
      <div className="goal-overview">
        {goal.currentWeight && goal.targetWeight && (
          <div className="weight-info">
            <span className="weight-current">{goal.currentWeight} kg</span>
            <span className="weight-arrow">→</span>
            <span className="weight-target">{goal.targetWeight} kg</span>
          </div>
        )}
        <div className="date-range">
          {formatDate(goal.startDate)} - {formatDate(goal.targetDate)}
        </div>
      </div>

      {/* 连续达标徽章 */}
      {consecutiveDays >= 3 && (
        <div className="achievement-badge">
          <span className="badge-icon">🔥</span>
          <span className="badge-text">连续达标 {consecutiveDays} 天</span>
        </div>
      )}

      {/* 今日达成情况 */}
      <div className="daily-status">
        <div className="status-header">
          <h3>今日达成情况</h3>
          <span
            className={`status-indicator ${dailyAchievement.overallAchieved ? 'achieved' : 'pending'}`}
          >
            {dailyAchievement.overallAchieved ? '✓ 已达标' : '⏳ 进行中'}
          </span>
        </div>

        {/* 卡路里进度 */}
        <div className="calorie-progress">
          <div className="progress-label">
            <span>卡路里</span>
            <span className="progress-value">
              {todayIntake.calories} / {goal.dailyCalorieGoal} kcal
            </span>
          </div>
          <div className="progress-bar-wrapper">
            <div
              className={`progress-bar ${dailyAchievement.caloriesAchieved ? 'achieved' : ''}`}
              style={{
                width: `${calculateNutrientPercentage(todayIntake.calories, goal.dailyCalorieGoal)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 营养素对比 */}
      <div className="nutrition-comparison">
        <h3>营养素对比</h3>
        <div className="nutrients-grid">
          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-icon">🥩</span>
              <span className="nutrient-name">蛋白质</span>
            </div>
            <div className="nutrient-values">
              <span className="actual-value">{todayIntake.protein.toFixed(1)}g</span>
              <span className="target-value">/ {goal.macroGoals.protein}g</span>
            </div>
            <div className="nutrient-bar-wrapper">
              <div
                className={`nutrient-bar ${dailyAchievement.proteinAchieved ? 'achieved' : ''}`}
                style={{
                  width: `${calculateNutrientPercentage(todayIntake.protein, goal.macroGoals.protein)}%`,
                }}
              />
            </div>
          </div>

          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-icon">🥑</span>
              <span className="nutrient-name">脂肪</span>
            </div>
            <div className="nutrient-values">
              <span className="actual-value">{todayIntake.fat.toFixed(1)}g</span>
              <span className="target-value">/ {goal.macroGoals.fat}g</span>
            </div>
            <div className="nutrient-bar-wrapper">
              <div
                className={`nutrient-bar ${dailyAchievement.fatAchieved ? 'achieved' : ''}`}
                style={{
                  width: `${calculateNutrientPercentage(todayIntake.fat, goal.macroGoals.fat)}%`,
                }}
              />
            </div>
          </div>

          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-icon">🍚</span>
              <span className="nutrient-name">碳水</span>
            </div>
            <div className="nutrient-values">
              <span className="actual-value">{todayIntake.carbs.toFixed(1)}g</span>
              <span className="target-value">/ {goal.macroGoals.carbs}g</span>
            </div>
            <div className="nutrient-bar-wrapper">
              <div
                className={`nutrient-bar ${dailyAchievement.carbsAchieved ? 'achieved' : ''}`}
                style={{
                  width: `${calculateNutrientPercentage(todayIntake.carbs, goal.macroGoals.carbs)}%`,
                }}
              />
            </div>
          </div>

          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-icon">🌾</span>
              <span className="nutrient-name">纤维</span>
            </div>
            <div className="nutrient-values">
              <span className="actual-value">{todayIntake.fiber.toFixed(1)}g</span>
              <span className="target-value">/ {goal.macroGoals.fiber}g</span>
            </div>
            <div className="nutrient-bar-wrapper">
              <div
                className={`nutrient-bar ${dailyAchievement.fiberAchieved ? 'achieved' : ''}`}
                style={{
                  width: `${calculateNutrientPercentage(todayIntake.fiber, goal.macroGoals.fiber)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 状态标签 */}
      {goal.status === 'paused' && (
        <div className="paused-overlay">
          <span className="paused-label">⏸️ 已暂停</span>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
