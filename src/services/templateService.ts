import { MealTemplate, MealType, FoodItem, NutritionInfo } from '../types';

const STORAGE_KEY = 'templates';

/**
 * 计算食物列表的总卡路里
 */
function calculateTotalCalories(foods: FoodItem[]): number {
  return foods.reduce((sum, food) => sum + food.calories, 0);
}

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
 * 生成唯一 ID
 */
function generateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 从 LocalStorage 获取所有模板
 */
function getTemplatesFromStorage(): MealTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const templates = JSON.parse(data);
    return templates.map((template: any) => ({
      ...template,
      createdAt: new Date(template.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load templates from storage:', error);
    return [];
  }
}

/**
 * 保存模板到 LocalStorage
 */
function saveTemplatesToStorage(templates: MealTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save templates to storage:', error);
    throw new Error('STORAGE_FULL: 存储空间已满，请清理旧数据');
  }
}

/**
 * 创建新模板
 */
export function createTemplate(
  name: string,
  mealType: MealType,
  foods: FoodItem[],
  userId: string = 'default'
): MealTemplate {
  if (!name || name.trim().length === 0) {
    throw new Error('INVALID_TEMPLATE_NAME: 模板名称不能为空');
  }

  if (!foods || foods.length === 0) {
    throw new Error('INVALID_TEMPLATE_FOODS: 模板必须包含至少一个食物');
  }

  const templates = getTemplatesFromStorage();

  const newTemplate: MealTemplate = {
    id: generateId(),
    userId,
    name: name.trim(),
    mealType,
    foods: [...foods], // 创建副本避免引用问题
    totalCalories: calculateTotalCalories(foods),
    totalNutrition: calculateTotalNutrition(foods),
    usageCount: 0,
    createdAt: new Date(),
  };

  templates.push(newTemplate);
  saveTemplatesToStorage(templates);

  return newTemplate;
}

/**
 * 获取所有模板
 */
export function getAllTemplates(): MealTemplate[] {
  return getTemplatesFromStorage();
}

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): MealTemplate | null {
  const templates = getTemplatesFromStorage();
  return templates.find((template) => template.id === id) || null;
}

/**
 * 根据餐次类型获取模板
 */
export function getTemplatesByMealType(mealType: MealType): MealTemplate[] {
  const templates = getTemplatesFromStorage();
  return templates.filter((template) => template.mealType === mealType);
}

/**
 * 更新模板
 */
export function updateTemplate(
  id: string,
  updates: Partial<Omit<MealTemplate, 'id' | 'userId' | 'createdAt' | 'usageCount'>>
): MealTemplate | null {
  const templates = getTemplatesFromStorage();
  const index = templates.findIndex((template) => template.id === id);

  if (index === -1) {
    console.error(`Template with id ${id} not found`);
    return null;
  }

  const updatedTemplate: MealTemplate = {
    ...templates[index],
    ...updates,
  };

  // 如果食物列表更新了，重新计算总营养和卡路里
  if (updates.foods) {
    updatedTemplate.totalCalories = calculateTotalCalories(updates.foods);
    updatedTemplate.totalNutrition = calculateTotalNutrition(updates.foods);
  }

  templates[index] = updatedTemplate;
  saveTemplatesToStorage(templates);

  return updatedTemplate;
}

/**
 * 删除模板
 */
export function deleteTemplate(id: string): boolean {
  const templates = getTemplatesFromStorage();
  const filteredTemplates = templates.filter((template) => template.id !== id);

  if (filteredTemplates.length === templates.length) {
    console.error(`Template with id ${id} not found`);
    return false;
  }

  saveTemplatesToStorage(filteredTemplates);
  return true;
}

/**
 * 应用模板 - 返回模板中的食物列表副本
 * 同时增加模板的使用次数
 */
export function applyTemplate(id: string): FoodItem[] | null {
  const templates = getTemplatesFromStorage();
  const index = templates.findIndex((template) => template.id === id);

  if (index === -1) {
    console.error(`Template with id ${id} not found`);
    return null;
  }

  // 增加使用次数
  templates[index].usageCount++;
  saveTemplatesToStorage(templates);

  // 返回食物列表的深拷贝
  return templates[index].foods.map((food) => ({
    ...food,
    nutrition: { ...food.nutrition },
  }));
}

/**
 * 按使用次数排序获取模板
 */
export function getTemplatesSortedByUsage(): MealTemplate[] {
  const templates = getTemplatesFromStorage();
  return templates.sort((a, b) => b.usageCount - a.usageCount);
}

/**
 * 清除所有模板
 */
export function clearAllTemplates(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取模板统计信息
 */
export function getTemplateStats(): {
  totalCount: number;
  byMealType: Record<MealType, number>;
  mostUsed: MealTemplate | null;
} {
  const templates = getTemplatesFromStorage();

  const byMealType: Record<MealType, number> = {
    [MealType.BREAKFAST]: 0,
    [MealType.LUNCH]: 0,
    [MealType.DINNER]: 0,
    [MealType.SNACK]: 0,
  };

  templates.forEach((template) => {
    byMealType[template.mealType]++;
  });

  const mostUsed =
    templates.length > 0
      ? templates.reduce((prev, current) =>
          prev.usageCount > current.usageCount ? prev : current
        )
      : null;

  return {
    totalCount: templates.length,
    byMealType,
    mostUsed,
  };
}
