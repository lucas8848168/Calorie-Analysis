import { AnalyzeResponse, FoodItem, AnalysisResult } from '../types';

/**
 * 解析API响应
 */
export function parseAnalysisResponse(response: AnalyzeResponse): AnalysisResult | null {
  if (!response.success || !response.data) {
    return null;
  }

  const { foods, totalCalories, confidence } = response.data;

  // 验证数据完整性
  if (!Array.isArray(foods)) {
    throw new Error('Invalid response format: foods must be an array');
  }

  // 解析食物列表
  const parsedFoods: FoodItem[] = foods.map((food) => {
    // 验证必需字段
    if (!food.name || typeof food.calories !== 'number') {
      throw new Error('Invalid food item: missing required fields');
    }

    // 验证营养信息
    if (!food.nutrition) {
      throw new Error('Invalid food item: missing nutrition data');
    }

    const { protein, fat, carbs, fiber } = food.nutrition;
    if (
      typeof protein !== 'number' ||
      typeof fat !== 'number' ||
      typeof carbs !== 'number' ||
      typeof fiber !== 'number'
    ) {
      throw new Error('Invalid nutrition data: all fields must be numbers');
    }

    return {
      name: food.name,
      calories: food.calories,
      nutrition: {
        protein,
        fat,
        carbs,
        fiber,
      },
    };
  });

  // 生成分析结果
  const result: AnalysisResult = {
    id: generateId(),
    timestamp: Date.now(),
    imageUrl: '', // 将在调用处设置
    foods: parsedFoods,
    totalCalories: totalCalories || calculateTotalCalories(parsedFoods),
    confidence,
  };

  return result;
}

/**
 * 计算总卡路里
 */
export function calculateTotalCalories(foods: FoodItem[]): number {
  return foods.reduce((sum, food) => sum + food.calories, 0);
}

/**
 * 验证食物项数据完整性
 */
export function validateFoodItem(food: any): boolean {
  if (!food || typeof food !== 'object') {
    return false;
  }

  // 检查必需字段
  if (!food.name || typeof food.calories !== 'number' || food.calories < 0) {
    return false;
  }

  // 检查营养信息
  if (!food.nutrition || typeof food.nutrition !== 'object') {
    return false;
  }

  const { protein, fat, carbs, fiber } = food.nutrition;
  if (
    typeof protein !== 'number' ||
    typeof fat !== 'number' ||
    typeof carbs !== 'number' ||
    typeof fiber !== 'number' ||
    protein < 0 ||
    fat < 0 ||
    carbs < 0 ||
    fiber < 0
  ) {
    return false;
  }

  return true;
}

/**
 * 格式化卡路里显示（带单位）
 */
export function formatCalories(calories: number): string {
  return `${calories.toFixed(0)} kcal`;
}

/**
 * 格式化营养成分显示
 */
export function formatNutrition(value: number, unit: string = 'g'): string {
  return `${value.toFixed(1)}${unit}`;
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检查是否为空结果
 */
export function isEmptyResult(response: AnalyzeResponse): boolean {
  return Boolean(
    response.success &&
    response.data &&
    Array.isArray(response.data.foods) &&
    response.data.foods.length === 0
  );
}

/**
 * 过滤非食物项（根据置信度或其他标记）
 */
export function filterFoodItems(foods: FoodItem[]): FoodItem[] {
  // 这里可以添加更复杂的过滤逻辑
  // 目前假设API已经返回了过滤后的食物
  return foods.filter((food) => validateFoodItem(food));
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  
  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  
  // 显示日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
