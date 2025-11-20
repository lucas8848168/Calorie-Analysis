import { useState, useEffect, useCallback } from 'react';
import { MealRecord, MealType } from '../types';
import {
  getMealsByDateRange,
  getMealsByType,
  deleteMeal,
  updateMeal,
} from '../services/mealService';

interface UseMealRecordsOptions {
  startDate?: Date;
  endDate?: Date;
  autoLoad?: boolean;
}

/**
 * 自定义Hook：管理餐次记录
 * 提供餐次数据的获取、更新、删除功能
 */
export function useMealRecords(options: UseMealRecordsOptions = {}) {
  const { startDate, endDate, autoLoad = true } = options;

  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载餐次记录
  const loadMeals = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      let records: MealRecord[];

      if (startDate && endDate) {
        records = getMealsByDateRange(startDate, endDate);
      } else if (startDate) {
        // 只有开始日期，加载从该日期到今天的记录
        records = getMealsByDateRange(startDate, new Date());
      } else {
        // 没有日期范围，加载最近30天
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        records = getMealsByDateRange(start, end);
      }

      setMeals(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载餐次记录失败');
      console.error('Failed to load meals:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // 按餐次类型过滤
  const getMealsByMealType = useCallback(
    (mealType: MealType) => {
      return getMealsByType(mealType);
    },
    []
  );

  // 删除餐次
  const removeMeal = useCallback(
    (mealId: string) => {
      try {
        deleteMeal(mealId);
        setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除餐次失败');
        console.error('Failed to delete meal:', err);
        return false;
      }
    },
    []
  );

  // 更新餐次
  const modifyMeal = useCallback((mealId: string, updates: Partial<MealRecord>) => {
    try {
      const updated = updateMeal(mealId, updates);
      if (updated) {
        setMeals((prev) => prev.map((meal) => (meal.id === mealId ? updated : meal)));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新餐次失败');
      console.error('Failed to update meal:', err);
      return false;
    }
  }, []);

  // 刷新数据
  const refresh = useCallback(() => {
    loadMeals();
  }, [loadMeals]);

  // 自动加载
  useEffect(() => {
    if (autoLoad) {
      loadMeals();
    }
  }, [autoLoad, loadMeals]);

  return {
    meals,
    isLoading,
    error,
    loadMeals,
    getMealsByMealType,
    removeMeal,
    modifyMeal,
    refresh,
  };
}
