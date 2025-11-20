import React, { useState } from 'react';
import QuickAddPanel from './QuickAddPanel';
import { MealType, FoodItem } from '../../types';
import './QuickAddDemo.css';

/**
 * QuickAddPanel 演示组件
 * 用于测试和展示快速添加面板的功能
 */
const QuickAddDemo: React.FC = () => {
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.BREAKFAST);
  const [addedFoods, setAddedFoods] = useState<FoodItem[]>([]);

  const handleFoodAdded = (food: FoodItem) => {
    setAddedFoods((prev) => [...prev, food]);
    console.log('添加食物:', food);
  };

  const handleClearAll = () => {
    setAddedFoods([]);
  };

  const totalCalories = addedFoods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div className="quick-add-demo">
      <div className="demo-header">
        <h2>快速添加面板演示</h2>
        <p>测试常吃食物和最近食用功能</p>
      </div>

      <div className="demo-content">
        <div className="demo-left">
          <div className="meal-type-selector-demo">
            <h3>选择餐次类型</h3>
            <div className="meal-type-buttons">
              {Object.values(MealType).map((type) => (
                <button
                  key={type}
                  className={`meal-type-btn ${selectedMealType === type ? 'active' : ''}`}
                  onClick={() => setSelectedMealType(type)}
                >
                  {type === MealType.BREAKFAST && '🌅 早餐'}
                  {type === MealType.LUNCH && '🌞 午餐'}
                  {type === MealType.DINNER && '🌙 晚餐'}
                  {type === MealType.SNACK && '🍎 加餐'}
                </button>
              ))}
            </div>
          </div>

          <QuickAddPanel
            targetMealType={selectedMealType}
            onFoodAdded={handleFoodAdded}
          />
        </div>

        <div className="demo-right">
          <div className="added-foods-panel">
            <div className="panel-header">
              <h3>已添加的食物</h3>
              {addedFoods.length > 0 && (
                <button className="clear-btn" onClick={handleClearAll}>
                  清空
                </button>
              )}
            </div>

            {addedFoods.length === 0 ? (
              <div className="empty-state">
                <p>还没有添加食物</p>
                <p className="hint">从左侧面板选择食物添加</p>
              </div>
            ) : (
              <>
                <div className="food-list">
                  {addedFoods.map((food, index) => (
                    <div key={index} className="food-item">
                      <div className="food-info">
                        <span className="food-name">{food.name}</span>
                        <span className="food-calories">{food.calories} kcal</span>
                      </div>
                      <div className="food-nutrition">
                        <span>蛋白质: {food.nutrition.protein.toFixed(1)}g</span>
                        <span>脂肪: {food.nutrition.fat.toFixed(1)}g</span>
                        <span>碳水: {food.nutrition.carbs.toFixed(1)}g</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total-summary">
                  <div className="summary-item">
                    <span className="label">总计食物:</span>
                    <span className="value">{addedFoods.length} 项</span>
                  </div>
                  <div className="summary-item highlight">
                    <span className="label">总卡路里:</span>
                    <span className="value">{totalCalories.toFixed(0)} kcal</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddDemo;
