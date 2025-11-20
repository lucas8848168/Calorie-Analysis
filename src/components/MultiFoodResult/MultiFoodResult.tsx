import React, { useState, useCallback } from 'react';
import { FoodItem, NutritionInfo } from '../../types';
import './MultiFoodResult.css';

interface MultiFoodResultProps {
  foods: FoodItem[];
  onFoodsChange: (foods: FoodItem[]) => void;
}

const MultiFoodResult: React.FC<MultiFoodResultProps> = ({ foods, onFoodsChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<{ [key: number]: number }>({});

  // 计算总营养信息
  const calculateTotalNutrition = useCallback((): NutritionInfo & { calories: number } => {
    return foods.reduce(
      (total, food) => {
        const multiplier = portionMultiplier[foods.indexOf(food)] || 1;
        return {
          calories: total.calories + food.calories * multiplier,
          protein: total.protein + food.nutrition.protein * multiplier,
          fat: total.fat + food.nutrition.fat * multiplier,
          carbs: total.carbs + food.nutrition.carbs * multiplier,
          fiber: total.fiber + food.nutrition.fiber * multiplier,
        };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
    );
  }, [foods, portionMultiplier]);

  // 删除食物项
  const handleDeleteFood = useCallback(
    (index: number) => {
      const newFoods = foods.filter((_, i) => i !== index);
      onFoodsChange(newFoods);
      
      // 清理该项的份量倍数
      const newMultipliers = { ...portionMultiplier };
      delete newMultipliers[index];
      setPortionMultiplier(newMultipliers);
    },
    [foods, portionMultiplier, onFoodsChange]
  );

  // 调整份量
  const handlePortionChange = useCallback(
    (index: number, multiplier: number) => {
      if (multiplier <= 0 || multiplier > 10) return; // 限制范围
      
      setPortionMultiplier((prev) => ({
        ...prev,
        [index]: multiplier,
      }));
    },
    []
  );

  // 开始编辑
  const handleStartEdit = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  // 完成编辑
  const handleFinishEdit = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const totalNutrition = calculateTotalNutrition();

  if (foods.length === 0) {
    return (
      <div className="multi-food-result empty">
        <p className="empty-message">暂无识别结果</p>
      </div>
    );
  }

  return (
    <div className="multi-food-result">
      <div className="result-header">
        <h3>识别结果 ({foods.length} 个食物)</h3>
        <p className="hint">点击食物项可调整份量</p>
      </div>

      <div className="food-list">
        {foods.map((food, index) => {
          const multiplier = portionMultiplier[index] || 1;
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className={`food-item ${isEditing ? 'editing' : ''}`}
              onClick={() => !isEditing && handleStartEdit(index)}
            >
              <div className="food-header">
                <div className="food-title">
                  <span className="food-number">#{index + 1}</span>
                  <span className="food-name">{food.name}</span>
                  {food.boundingBox && (
                    <span className="has-bbox" title="已标注位置">
                      📍
                    </span>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFood(index);
                  }}
                  title="删除此食物"
                >
                  ×
                </button>
              </div>

              <div className="food-details">
                <div className="calories">
                  <span className="value">{Math.round(food.calories * multiplier)}</span>
                  <span className="unit">kcal</span>
                </div>

                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="label">蛋白质</span>
                    <span className="value">
                      {(food.nutrition.protein * multiplier).toFixed(1)}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">脂肪</span>
                    <span className="value">
                      {(food.nutrition.fat * multiplier).toFixed(1)}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">碳水</span>
                    <span className="value">
                      {(food.nutrition.carbs * multiplier).toFixed(1)}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">纤维</span>
                    <span className="value">
                      {(food.nutrition.fiber * multiplier).toFixed(1)}g
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="portion-editor" onClick={(e) => e.stopPropagation()}>
                  <label>份量倍数:</label>
                  <div className="portion-controls">
                    <button
                      onClick={() => handlePortionChange(index, Math.max(0.5, multiplier - 0.5))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={multiplier}
                      onChange={(e) => handlePortionChange(index, parseFloat(e.target.value))}
                    />
                    <button
                      onClick={() => handlePortionChange(index, Math.min(10, multiplier + 0.5))}
                    >
                      +
                    </button>
                  </div>
                  <button className="done-btn" onClick={handleFinishEdit}>
                    完成
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="total-section">
        <h4>营养总计</h4>
        <div className="total-grid">
          <div className="total-item calories">
            <span className="label">总卡路里</span>
            <span className="value">{Math.round(totalNutrition.calories)} kcal</span>
          </div>
          <div className="total-item">
            <span className="label">蛋白质</span>
            <span className="value">{totalNutrition.protein.toFixed(1)}g</span>
          </div>
          <div className="total-item">
            <span className="label">脂肪</span>
            <span className="value">{totalNutrition.fat.toFixed(1)}g</span>
          </div>
          <div className="total-item">
            <span className="label">碳水化合物</span>
            <span className="value">{totalNutrition.carbs.toFixed(1)}g</span>
          </div>
          <div className="total-item">
            <span className="label">膳食纤维</span>
            <span className="value">{totalNutrition.fiber.toFixed(1)}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFoodResult;
