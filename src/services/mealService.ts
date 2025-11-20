import { MealRecord, MealType, FoodItem, NutritionInfo, AnalysisResult } from '../types';
import { autoCleanup, hasEnoughSpace } from '../utils/storageOptimizer';
import { historyStorage } from './historyStorage';

const STORAGE_KEY = 'meals';

/**
 * 计算食物列表的总营养信息
 */
function calculateTotalNutrition(foods: FoodItem[]): NutritionInfo {
  return foods.reduce(
    (total, food) => ({
      protein: total.protein + food.nutrition.protein,
      fat: total.fat + food.nutrition.fat,
      carbs: total.carbs + food.nutrition.carbs,
      fiber: total.fiber + food.nutrition.fiber,
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );
}

/**
 * 将 AnalysisResult 转换为 MealRecord
 */
function convertAnalysisResultToMealRecord(result: AnalysisResult): MealRecord {
  const mealTime = new Date(result.timestamp);
  const hour = mealTime.getHours();
  
  // 根据时间推断餐次类型
  let mealType: MealType;
  if (hour >= 6 && hour < 10) {
    mealType = MealType.BREAKFAST;
  } else if (hour >= 11 && hour < 14) {
    mealType = MealType.LUNCH;
  } else if (hour >= 17 && hour < 21) {
    mealType = MealType.DINNER;
  } else {
    mealType = MealType.SNACK;
  }
  
  return {
    id: result.id,
    userId: 'default',
    mealType,
    mealTime,
    foods: result.foods,
    totalNutrition: calculateTotalNutrition(result.foods),
    notes: result.notes,
    photos: result.imageUrl ? [result.imageUrl] : [],
    createdAt: mealTime,
    updatedAt: mealTime,
  };
}

/**
 * 从 LocalStorage 获取所有餐次记录
 * 同时从历史记录中读取并转换数据
 */
function getMealsFromStorage(): MealRecord[] {
  try {
    // 1. 读取新格式的 meals 数据
    const data = localStorage.getItem(STORAGE_KEY);
    let meals: MealRecord[] = [];
    
    if (data) {
      const parsedMeals = JSON.parse(data);
      meals = parsedMeals.map((meal: any) => ({
        ...meal,
        mealTime: new Date(meal.mealTime),
        createdAt: new Date(meal.createdAt),
        updatedAt: new Date(meal.updatedAt),
      }));
    }
    
    // 2. 读取历史记录并转换为 MealRecord
    const historyRecords = historyStorage.getRecords();
    const convertedMeals = historyRecords.map(convertAnalysisResultToMealRecord);
    
    // 3. 合并两个数据源，去重（优先使用 meals 中的数据）
    const mealIds = new Set(meals.map(m => m.id));
    const uniqueConvertedMeals = convertedMeals.filter(m => !mealIds.has(m.id));
    
    return [...meals, ...uniqueConvertedMeals];
  } catch (error) {
    console.error('Failed to load meals from storage:', error);
    return [];
  }
}

/**
 * 保存餐次记录到 LocalStorage
 * 包含自动清理功能
 */
function saveMealsToStorage(meals: MealRecord[]): void {
  try {
    const dataSize = JSON.stringify(meals).length;

    // 检查空间是否足够
    if (!hasEnoughSpace(dataSize)) {
      // 尝试自动清理
      autoCleanup();

      // 再次检查
      if (!hasEnoughSpace(dataSize)) {
        throw new Error('STORAGE_FULL: 存储空间已满，请清理旧数据');
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error('Failed to save meals to storage:', error);
    if (error instanceof Error && error.message.includes('STORAGE_FULL')) {
      throw error;
    }
    throw new Error('STORAGE_FULL: 存储空间已满，请清理旧数据');
  }
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 保存新的餐次记录
 */
export function saveMeal(meal: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>): MealRecord {
  const meals = getMealsFromStorage();

  const newMeal: MealRecord = {
    ...meal,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    totalNutrition: calculateTotalNutrition(meal.foods),
  };

  meals.push(newMeal);
  saveMealsToStorage(meals);

  return newMeal;
}

/**
 * 获取指定日期的所有餐次记录
 */
export function getMealsByDate(date: Date): MealRecord[] {
  const meals = getMealsFromStorage();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return meals.filter((meal) => {
    const mealDate = new Date(meal.mealTime);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === targetDate.getTime();
  });
}

/**
 * 获取日期范围内的所有餐次记录
 */
export function getMealsByDateRange(startDate: Date, endDate: Date): MealRecord[] {
  const meals = getMealsFromStorage();
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return meals.filter((meal) => {
    const mealTime = new Date(meal.mealTime).getTime();
    return mealTime >= start.getTime() && mealTime <= end.getTime();
  });
}

/**
 * 按餐次类型过滤
 */
export function getMealsByType(mealType: MealType, date?: Date): MealRecord[] {
  const meals = date ? getMealsByDate(date) : getMealsFromStorage();
  return meals.filter((meal) => meal.mealType === mealType);
}

/**
 * 更新餐次记录
 */
export function updateMeal(
  id: string,
  updates: Partial<Omit<MealRecord, 'id' | 'createdAt'>>
): MealRecord | null {
  const meals = getMealsFromStorage();
  const index = meals.findIndex((meal) => meal.id === id);

  if (index === -1) {
    console.error(`Meal with id ${id} not found`);
    return null;
  }

  const updatedMeal: MealRecord = {
    ...meals[index],
    ...updates,
    updatedAt: new Date(),
  };

  // 如果食物列表更新了，重新计算总营养
  if (updates.foods) {
    updatedMeal.totalNutrition = calculateTotalNutrition(updates.foods);
  }

  meals[index] = updatedMeal;
  saveMealsToStorage(meals);

  return updatedMeal;
}

/**
 * 删除餐次记录
 */
export function deleteMeal(id: string): boolean {
  const meals = getMealsFromStorage();
  const filteredMeals = meals.filter((meal) => meal.id !== id);

  if (filteredMeals.length === meals.length) {
    console.error(`Meal with id ${id} not found`);
    return false;
  }

  saveMealsToStorage(filteredMeals);
  return true;
}

/**
 * 获取单个餐次记录
 */
export function getMealById(id: string): MealRecord | null {
  const meals = getMealsFromStorage();
  return meals.find((meal) => meal.id === id) || null;
}

/**
 * 获取所有餐次记录
 */
export function getAllMeals(): MealRecord[] {
  return getMealsFromStorage();
}

/**
 * 清除所有餐次记录
 */
export function clearAllMeals(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取餐次统计信息
 */
export function getMealStats(date: Date): {
  totalCalories: number;
  totalNutrition: NutritionInfo;
  mealCount: number;
  mealsByType: Record<MealType, number>;
} {
  const meals = getMealsByDate(date);

  const totalNutrition = meals.reduce(
    (total, meal) => ({
      protein: total.protein + meal.totalNutrition.protein,
      fat: total.fat + meal.totalNutrition.fat,
      carbs: total.carbs + meal.totalNutrition.carbs,
      fiber: total.fiber + meal.totalNutrition.fiber,
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );

  const totalCalories = meals.reduce((sum, meal) => {
    const mealCalories = meal.foods.reduce((total, food) => total + food.calories, 0);
    return sum + mealCalories;
  }, 0);

  const mealsByType: Record<MealType, number> = {
    [MealType.BREAKFAST]: 0,
    [MealType.LUNCH]: 0,
    [MealType.DINNER]: 0,
    [MealType.SNACK]: 0,
  };

  meals.forEach((meal) => {
    mealsByType[meal.mealType]++;
  });

  return {
    totalCalories,
    totalNutrition,
    mealCount: meals.length,
    mealsByType,
  };
}