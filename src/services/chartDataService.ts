import { MealRecord, MealType, ChartDataPoint, MacroNutrition } from '../types';
import { getMealsByDateRange } from './mealService';

/**
 * 获取指定时间范围的图表数据点
 */
export function getChartDataByDateRange(
  startDate: Date,
  endDate: Date
): ChartDataPoint[] {
  const meals = getMealsByDateRange(startDate, endDate);
  
  // 按日期分组
  const mealsByDate = new Map<string, MealRecord[]>();
  
  meals.forEach((meal) => {
    const dateKey = new Date(meal.mealTime).toISOString().split('T')[0];
    if (!mealsByDate.has(dateKey)) {
      mealsByDate.set(dateKey, []);
    }
    mealsByDate.get(dateKey)!.push(meal);
  });
  
  // 生成数据点
  const dataPoints: ChartDataPoint[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const dayMeals = mealsByDate.get(dateKey) || [];
    
    const totalCalories = dayMeals.reduce((sum, meal) => {
      return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
    }, 0);
    
    dataPoints.push({
      date: new Date(currentDate),
      calories: totalCalories,
      meals: dayMeals,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dataPoints;
}

/**
 * 获取日视图数据（当天）
 */
export function getDayViewData(date: Date): ChartDataPoint[] {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return getChartDataByDateRange(startDate, endDate);
}

/**
 * 获取周视图数据（最近7天）
 */
export function getWeekViewData(endDate: Date = new Date()): ChartDataPoint[] {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  
  return getChartDataByDateRange(start, end);
}

/**
 * 获取月视图数据（最近30天）
 */
export function getMonthViewData(endDate: Date = new Date()): ChartDataPoint[] {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  
  return getChartDataByDateRange(start, end);
}

/**
 * 计算平均每日卡路里
 */
export function calculateAverageDailyCalories(dataPoints: ChartDataPoint[]): number {
  if (dataPoints.length === 0) return 0;
  
  const totalCalories = dataPoints.reduce((sum, point) => sum + point.calories, 0);
  return Math.round(totalCalories / dataPoints.length);
}

/**
 * 计算时间范围内的总营养摄入
 */
export function calculateTotalNutrition(meals: MealRecord[]): MacroNutrition {
  return meals.reduce(
    (total, meal) => ({
      protein: total.protein + meal.totalNutrition.protein,
      fat: total.fat + meal.totalNutrition.fat,
      carbs: total.carbs + meal.totalNutrition.carbs,
      fiber: total.fiber + meal.totalNutrition.fiber,
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );
}

/**
 * 计算平均营养摄入
 */
export function calculateAverageNutrition(
  meals: MealRecord[],
  days: number
): MacroNutrition {
  const total = calculateTotalNutrition(meals);
  
  if (days === 0) {
    return { protein: 0, fat: 0, carbs: 0, fiber: 0 };
  }
  
  return {
    protein: Math.round((total.protein / days) * 10) / 10,
    fat: Math.round((total.fat / days) * 10) / 10,
    carbs: Math.round((total.carbs / days) * 10) / 10,
    fiber: Math.round((total.fiber / days) * 10) / 10,
  };
}

/**
 * 计算餐次分布（按卡路里）
 */
export function calculateMealDistribution(meals: MealRecord[]): {
  [key in MealType]: number;
} {
  const distribution = {
    [MealType.BREAKFAST]: 0,
    [MealType.LUNCH]: 0,
    [MealType.DINNER]: 0,
    [MealType.SNACK]: 0,
  };
  
  meals.forEach((meal) => {
    const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
    distribution[meal.mealType] += mealCalories;
  });
  
  return distribution;
}

/**
 * 计算餐次分布百分比
 */
export function calculateMealDistributionPercentage(meals: MealRecord[]): {
  [key in MealType]: number;
} {
  const distribution = calculateMealDistribution(meals);
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return {
      [MealType.BREAKFAST]: 0,
      [MealType.LUNCH]: 0,
      [MealType.DINNER]: 0,
      [MealType.SNACK]: 0,
    };
  }
  
  return {
    [MealType.BREAKFAST]: Math.round((distribution[MealType.BREAKFAST] / total) * 100),
    [MealType.LUNCH]: Math.round((distribution[MealType.LUNCH] / total) * 100),
    [MealType.DINNER]: Math.round((distribution[MealType.DINNER] / total) * 100),
    [MealType.SNACK]: Math.round((distribution[MealType.SNACK] / total) * 100),
  };
}

/**
 * 获取数据摘要
 */
export function getDataSummary(
  startDate: Date,
  endDate: Date
): {
  totalDays: number;
  totalMeals: number;
  totalCalories: number;
  averageDailyCalories: number;
  averageNutrition: MacroNutrition;
  mealDistribution: { [key in MealType]: number };
} {
  const meals = getMealsByDateRange(startDate, endDate);
  const dataPoints = getChartDataByDateRange(startDate, endDate);
  
  const totalCalories = meals.reduce((sum, meal) => {
    return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
  }, 0);
  
  const days = dataPoints.length;
  
  return {
    totalDays: days,
    totalMeals: meals.length,
    totalCalories,
    averageDailyCalories: calculateAverageDailyCalories(dataPoints),
    averageNutrition: calculateAverageNutrition(meals, days),
    mealDistribution: calculateMealDistribution(meals),
  };
}

/**
 * 格式化日期为显示文本
 */
export function formatDateForChart(date: Date, format: 'day' | 'week' | 'month'): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  switch (format) {
    case 'day':
      return `${month}/${day}`;
    case 'week':
      return `${month}/${day} ${weekdays[date.getDay()]}`;
    case 'month':
      return `${month}/${day}`;
    default:
      return `${month}/${day}`;
  }
}
