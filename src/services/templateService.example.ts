/**
 * Example usage of templateService with mealService
 * This demonstrates how to create and apply templates to meals
 */

import { createTemplate, applyTemplate, getTemplatesByMealType } from './templateService';
import { saveMeal } from './mealService';
import { MealType, FoodItem } from '../types';

// Example: Create a breakfast template
export function createBreakfastTemplate() {
  const breakfastFoods: FoodItem[] = [
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
    {
      name: '全麦面包',
      calories: 200,
      nutrition: { protein: 8, fat: 3, carbs: 35, fiber: 5 },
    },
  ];

  const template = createTemplate('健康早餐套餐', MealType.BREAKFAST, breakfastFoods);
  console.log('Created template:', template);
  return template;
}

// Example: Apply template to create a meal
export function applyTemplateToMeal(templateId: string) {
  // Get foods from template
  const foods = applyTemplate(templateId);
  
  if (!foods) {
    console.error('Template not found');
    return null;
  }

  // Create a meal using the template foods
  const meal = saveMeal({
    userId: 'default',
    mealType: MealType.BREAKFAST,
    mealTime: new Date(),
    foods: foods,
    totalNutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 }, // Will be calculated
  });

  console.log('Created meal from template:', meal);
  return meal;
}

// Example: Get all breakfast templates
export function getBreakfastTemplates() {
  const templates = getTemplatesByMealType(MealType.BREAKFAST);
  console.log('Breakfast templates:', templates);
  return templates;
}

// Example workflow
export function exampleWorkflow() {
  // 1. Create a template
  const template = createBreakfastTemplate();
  
  // 2. Apply template to create a meal
  const meal = applyTemplateToMeal(template.id);
  
  // 3. Get all breakfast templates
  const breakfastTemplates = getBreakfastTemplates();
  
  return { template, meal, breakfastTemplates };
}
