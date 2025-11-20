import React from 'react';
import { MealRecord } from '../../types';
import { deleteMeal } from '../../services/mealService';
import './MealCard.css';

interface MealCardProps {
  meal: MealRecord;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  isExpanded,
  onToggleExpand,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm('确定要删除这条餐次记录吗？')) {
      deleteMeal(meal.id);
      onDelete();
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div className={`meal-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="meal-card-header" onClick={onToggleExpand}>
        <div className="meal-time">{formatTime(meal.mealTime)}</div>
        <div className="meal-summary">
          <span className="food-count">{meal.foods.length} 项食物</span>
          <span className="calories">{totalCalories} kcal</span>
        </div>
        <button className="expand-button">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="meal-card-body">
          <div className="food-list">
            {meal.foods.map((food, index) => (
              <div key={index} className="food-item">
                <span className="food-name">{food.name}</span>
                <span className="food-calories">{food.calories} kcal</span>
              </div>
            ))}
          </div>

          <div className="nutrition-summary">
            <h4>营养小计</h4>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="label">蛋白质</span>
                <span className="value">
                  {meal.totalNutrition.protein.toFixed(1)}g
                </span>
              </div>
              <div className="nutrition-item">
                <span className="label">脂肪</span>
                <span className="value">
                  {meal.totalNutrition.fat.toFixed(1)}g
                </span>
              </div>
              <div className="nutrition-item">
                <span className="label">碳水</span>
                <span className="value">
                  {meal.totalNutrition.carbs.toFixed(1)}g
                </span>
              </div>
              <div className="nutrition-item">
                <span className="label">纤维</span>
                <span className="value">
                  {meal.totalNutrition.fiber.toFixed(1)}g
                </span>
              </div>
            </div>
          </div>

          {meal.notes && (
            <div className="meal-notes">
              <span className="notes-icon">📝</span>
              <span className="notes-text">{meal.notes}</span>
            </div>
          )}

          <div className="meal-actions">
            <button className="edit-button">编辑</button>
            <button className="delete-button" onClick={handleDelete}>
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealCard;
