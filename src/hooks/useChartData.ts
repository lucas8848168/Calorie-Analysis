import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChartDataPoint, MacroNutrition, MealType } from '../types';
import {
  getDayViewData,
  getWeekViewData,
  getMonthViewData,
  getDataSummary,
  calculateAverageNutrition,
} from '../services/chartDataService';
import { getMealsByDateRange } from '../services/mealService';

export type TimePeriod = 'day' | 'week' | 'month';

interface ChartDataSummary {
  totalDays: number;
  totalMeals: number;
  totalCalories: number;
  averageDailyCalories: number;
  averageNutrition: MacroNutrition;
  mealDistribution: Record<MealType, number>;
}

/**
 * 自定义Hook：管理图表数据
 * 提供图表数据的获取、聚合和计算功能
 */
export function useChartData(initialPeriod: TimePeriod = 'week') {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialPeriod);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载图表数据
  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      let data: ChartDataPoint[];

      switch (timePeriod) {
        case 'day':
          data = getDayViewData(new Date());
          break;
        case 'week':
          data = getWeekViewData();
          break;
        case 'month':
          data = getMonthViewData();
          break;
        default:
          data = getWeekViewData();
      }

      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载图表数据失败');
      console.error('Failed to load chart data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timePeriod]);

  // 计算数据摘要（使用useMemo优化）
  const summary = useMemo<ChartDataSummary>(() => {
    if (chartData.length === 0) {
      return {
        totalDays: 0,
        totalMeals: 0,
        totalCalories: 0,
        averageDailyCalories: 0,
        averageNutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 },
        mealDistribution: {
          [MealType.BREAKFAST]: 0,
          [MealType.LUNCH]: 0,
          [MealType.DINNER]: 0,
          [MealType.SNACK]: 0,
        },
      };
    }

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    return getDataSummary(startDate, endDate);
  }, [chartData]);

  // 获取实际营养摄入（使用useMemo优化）
  const actualNutrition = useMemo<MacroNutrition>(() => {
    if (chartData.length === 0) {
      return { protein: 0, fat: 0, carbs: 0, fiber: 0 };
    }

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    const meals = getMealsByDateRange(startDate, endDate);

    return calculateAverageNutrition(meals, chartData.length);
  }, [chartData]);

  // 获取所有餐次（使用useMemo优化）
  const allMeals = useMemo(() => {
    if (chartData.length === 0) return [];

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    return getMealsByDateRange(startDate, endDate);
  }, [chartData]);

  // 切换时间维度
  const changePeriod = useCallback((period: TimePeriod) => {
    setTimePeriod(period);
  }, []);

  // 刷新数据
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // 自动加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    timePeriod,
    chartData,
    summary,
    actualNutrition,
    allMeals,
    isLoading,
    error,
    changePeriod,
    refresh,
  };
}
