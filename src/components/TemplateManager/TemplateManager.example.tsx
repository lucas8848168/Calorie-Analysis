/**
 * Example usage of TemplateManager component
 * This demonstrates how to integrate the component into your application
 */

import React, { useState } from 'react';
import TemplateManager from './TemplateManager';
import { FoodItem, MealType } from '../../types';
import { saveMeal } from '../../services/mealService';

/**
 * Example 1: Basic usage - just display the template manager
 */
export function BasicTemplateManagerExample() {
  return (
    <div>
      <h1>模板管理</h1>
      <TemplateManager />
    </div>
  );
}

/**
 * Example 2: With callback to handle template application
 */
export function TemplateManagerWithCallbackExample() {
  const [message, setMessage] = useState<string>('');

  const handleApplyTemplate = (foods: FoodItem[], mealType: MealType) => {
    // Create a meal from the template
    const meal = saveMeal({
      userId: 'default',
      mealType: mealType,
      mealTime: new Date(),
      foods: foods,
      totalNutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 }, // Will be calculated
    });

    setMessage(`已应用模板，创建了新的${getMealTypeLabel(mealType)}记录`);
    console.log('Created meal from template:', meal);
  };

  const getMealTypeLabel = (mealType: MealType): string => {
    const labels = {
      [MealType.BREAKFAST]: '早餐',
      [MealType.LUNCH]: '午餐',
      [MealType.DINNER]: '晚餐',
      [MealType.SNACK]: '加餐',
    };
    return labels[mealType];
  };

  return (
    <div>
      <h1>模板管理</h1>
      {message && (
        <div style={{ padding: '1rem', background: '#e8f5e9', marginBottom: '1rem' }}>
          {message}
        </div>
      )}
      <TemplateManager onApplyTemplate={handleApplyTemplate} />
    </div>
  );
}

/**
 * Example 3: Integrated with meal planning workflow
 */
export function IntegratedTemplateManagerExample() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const handleApplyTemplate = (foods: FoodItem[], mealType: MealType) => {
    // Create a meal for the selected date
    const mealTime = new Date(selectedDate);
    
    // Set appropriate time based on meal type
    switch (mealType) {
      case MealType.BREAKFAST:
        mealTime.setHours(8, 0, 0, 0);
        break;
      case MealType.LUNCH:
        mealTime.setHours(12, 0, 0, 0);
        break;
      case MealType.DINNER:
        mealTime.setHours(18, 0, 0, 0);
        break;
      case MealType.SNACK:
        mealTime.setHours(15, 0, 0, 0);
        break;
    }

    const meal = saveMeal({
      userId: 'default',
      mealType: mealType,
      mealTime: mealTime,
      foods: foods,
      totalNutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 },
    });

    console.log('Created meal from template:', meal);
    setShowTemplateManager(false);
    alert('模板已应用到餐次！');
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>选择日期：</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
        <button onClick={() => setShowTemplateManager(!showTemplateManager)}>
          {showTemplateManager ? '关闭模板管理' : '打开模板管理'}
        </button>
      </div>

      {showTemplateManager && (
        <TemplateManager onApplyTemplate={handleApplyTemplate} />
      )}
    </div>
  );
}

/**
 * Example 4: Modal/Dialog usage
 */
export function TemplateManagerModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyTemplate = (foods: FoodItem[], mealType: MealType) => {
    console.log('Applied template:', { foods, mealType });
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        打开模板管理器
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <TemplateManager onApplyTemplate={handleApplyTemplate} />
          </div>
        </div>
      )}
    </div>
  );
}
