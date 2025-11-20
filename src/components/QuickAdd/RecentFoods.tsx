import React from 'react';
import { FoodItem } from '../../types';
import './RecentFoods.css';

interface RecentFoodsProps {
  foods: FoodItem[];
  onFoodAdd: (food: FoodItem) => void;
}

const RecentFoods: React.FC<RecentFoodsProps> = ({ foods, onFoodAdd }) => {
  if (foods.length === 0) {
    return (
      <div className="empty-recent">
        <div className="empty-icon">🕐</div>
        <p className="empty-message">最近7天没有饮食记录</p>
        <p className="empty-hint">开始记录你的饮食吧</p>
      </div>
    );
  }

  return (
    <div className="recent-foods">
      <div className="food-list">
        {foods.map((food, index) => (
          <div key={index} className="food-item">
            <div className="food-info">
              <div className="food-name">{food.name}</div>
              <div className="food-details">
                <span className="calories">{food.calories} kcal</span>
                <span className="nutrition">
                  蛋白质 {food.nutrition.protein.toFixed(1)}g
                </span>
              </div>
            </div>
            <button
              className="add-button"
              onClick={() => onFoodAdd(food)}
            >
              + 添加
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFoods;
