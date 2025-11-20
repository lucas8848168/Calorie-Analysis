import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTemplate,
  getAllTemplates,
  getTemplatesByMealType,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  applyTemplate,
  getTemplatesSortedByUsage,
  clearAllTemplates,
  getTemplateStats,
} from './templateService';
import { MealType, FoodItem } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('templateService', () => {
  const sampleFoods: FoodItem[] = [
    {
      name: '鸡蛋',
      calories: 150,
      nutrition: { protein: 13, fat: 10, carbs: 1, fiber: 0 },
    },
    {
      name: '牛奶',
      calories: 100,
      nutrition: { protein: 8, fat: 5, carbs: 12, fiber: 0 },
    },
  ];

  beforeEach(() => {
    clearAllTemplates();
  });

  describe('createTemplate', () => {
    it('should create a new template with correct properties', () => {
      const template = createTemplate('早餐套餐', MealType.BREAKFAST, sampleFoods);

      expect(template.id).toBeDefined();
      expect(template.name).toBe('早餐套餐');
      expect(template.mealType).toBe(MealType.BREAKFAST);
      expect(template.foods).toEqual(sampleFoods);
      expect(template.totalCalories).toBe(250);
      expect(template.totalNutrition).toEqual({
        protein: 21,
        fat: 15,
        carbs: 13,
        fiber: 0,
      });
      expect(template.usageCount).toBe(0);
      expect(template.createdAt).toBeInstanceOf(Date);
    });

    it('should save template to storage', () => {
      createTemplate('午餐套餐', MealType.LUNCH, sampleFoods);
      const templates = getAllTemplates();

      expect(templates).toHaveLength(1);
      expect(templates[0].name).toBe('午餐套餐');
    });
  });

  describe('getAllTemplates', () => {
    it('should return empty array when no templates exist', () => {
      const templates = getAllTemplates();
      expect(templates).toEqual([]);
    });

    it('should return all templates', () => {
      createTemplate('早餐', MealType.BREAKFAST, sampleFoods);
      createTemplate('午餐', MealType.LUNCH, sampleFoods);

      const templates = getAllTemplates();
      expect(templates).toHaveLength(2);
    });
  });

  describe('getTemplatesByMealType', () => {
    it('should filter templates by meal type', () => {
      createTemplate('早餐1', MealType.BREAKFAST, sampleFoods);
      createTemplate('早餐2', MealType.BREAKFAST, sampleFoods);
      createTemplate('午餐', MealType.LUNCH, sampleFoods);

      const breakfastTemplates = getTemplatesByMealType(MealType.BREAKFAST);
      expect(breakfastTemplates).toHaveLength(2);
      expect(breakfastTemplates.every((t) => t.mealType === MealType.BREAKFAST)).toBe(true);
    });
  });

  describe('getTemplateById', () => {
    it('should return template by id', () => {
      const created = createTemplate('测试模板', MealType.DINNER, sampleFoods);
      const found = getTemplateById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('测试模板');
    });

    it('should return null for non-existent id', () => {
      const found = getTemplateById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('updateTemplate', () => {
    it('should update template name', () => {
      const template = createTemplate('旧名称', MealType.BREAKFAST, sampleFoods);
      const updated = updateTemplate(template.id, { name: '新名称' });

      expect(updated?.name).toBe('新名称');
      expect(updated?.id).toBe(template.id);
    });

    it('should recalculate nutrition when foods are updated', () => {
      const template = createTemplate('测试', MealType.BREAKFAST, sampleFoods);
      const newFoods: FoodItem[] = [
        {
          name: '面包',
          calories: 200,
          nutrition: { protein: 5, fat: 2, carbs: 40, fiber: 3 },
        },
      ];

      const updated = updateTemplate(template.id, { foods: newFoods });

      expect(updated?.totalCalories).toBe(200);
      expect(updated?.totalNutrition).toEqual({
        protein: 5,
        fat: 2,
        carbs: 40,
        fiber: 3,
      });
    });

    it('should return null for non-existent template', () => {
      const updated = updateTemplate('non-existent', { name: '新名称' });
      expect(updated).toBeNull();
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template by id', () => {
      const template = createTemplate('待删除', MealType.SNACK, sampleFoods);
      const result = deleteTemplate(template.id);

      expect(result).toBe(true);
      expect(getTemplateById(template.id)).toBeNull();
    });

    it('should return false for non-existent template', () => {
      const result = deleteTemplate('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('applyTemplate', () => {
    it('should return foods from template', () => {
      const template = createTemplate('应用测试', MealType.BREAKFAST, sampleFoods);
      const foods = applyTemplate(template.id);

      expect(foods).toEqual(sampleFoods);
    });

    it('should increment usage count', () => {
      const template = createTemplate('使用测试', MealType.LUNCH, sampleFoods);
      
      applyTemplate(template.id);
      const updated = getTemplateById(template.id);
      expect(updated?.usageCount).toBe(1);

      applyTemplate(template.id);
      const updated2 = getTemplateById(template.id);
      expect(updated2?.usageCount).toBe(2);
    });

    it('should return null for non-existent template', () => {
      const foods = applyTemplate('non-existent');
      expect(foods).toBeNull();
    });

    it('should return a deep copy of foods', () => {
      const template = createTemplate('拷贝测试', MealType.DINNER, sampleFoods);
      const foods = applyTemplate(template.id);

      // Modify the returned foods
      if (foods) {
        foods[0].name = '修改后的名称';
      }

      // Original template should be unchanged
      const original = getTemplateById(template.id);
      expect(original?.foods[0].name).toBe('鸡蛋');
    });
  });

  describe('getTemplatesSortedByUsage', () => {
    it('should sort templates by usage count descending', () => {
      const template1 = createTemplate('模板1', MealType.BREAKFAST, sampleFoods);
      const template2 = createTemplate('模板2', MealType.LUNCH, sampleFoods);
      const template3 = createTemplate('模板3', MealType.DINNER, sampleFoods);

      // Apply templates different number of times
      applyTemplate(template1.id);
      applyTemplate(template2.id);
      applyTemplate(template2.id);
      applyTemplate(template3.id);
      applyTemplate(template3.id);
      applyTemplate(template3.id);

      const sorted = getTemplatesSortedByUsage();
      expect(sorted[0].id).toBe(template3.id); // 3 uses
      expect(sorted[1].id).toBe(template2.id); // 2 uses
      expect(sorted[2].id).toBe(template1.id); // 1 use
    });
  });

  describe('getTemplateStats', () => {
    it('should return correct statistics', () => {
      createTemplate('早餐1', MealType.BREAKFAST, sampleFoods);
      createTemplate('早餐2', MealType.BREAKFAST, sampleFoods);
      const lunchTemplate = createTemplate('午餐', MealType.LUNCH, sampleFoods);
      
      // Apply lunch template to make it most used
      applyTemplate(lunchTemplate.id);
      applyTemplate(lunchTemplate.id);

      const stats = getTemplateStats();

      expect(stats.totalCount).toBe(3);
      expect(stats.byMealType[MealType.BREAKFAST]).toBe(2);
      expect(stats.byMealType[MealType.LUNCH]).toBe(1);
      expect(stats.byMealType[MealType.DINNER]).toBe(0);
      expect(stats.byMealType[MealType.SNACK]).toBe(0);
      expect(stats.mostUsed?.id).toBe(lunchTemplate.id);
    });

    it('should handle empty templates', () => {
      const stats = getTemplateStats();

      expect(stats.totalCount).toBe(0);
      expect(stats.mostUsed).toBeNull();
    });
  });
});
