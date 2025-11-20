import React from 'react';
import { FoodItem } from '../../types';
import { removeFavorite } from '../../services/favoriteService';
import './FavoriteFoods.css';

interface FavoriteFoodsProps {
  foods: FoodItem[];
  onFoodAdd: (food: FoodItem) => void;
  onUpdate: () => void;
}

const FavoriteFoods: React.FC<FavoriteFoodsProps> = ({
  foods,
  onFoodAdd,
  onUpdate,
}) => {
  const handleRemoveFromFavorite = (food: FoodItem) => {
    // 需要通过名称找到收藏的 ID
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favorite = favorites.find((fav: any) => fav.foodItem.name === food.name);
    if (favorite) {
      removeFavorite(favorite.id);
      onUpdate();
    }
  };

  if (foods.length === 0) {
    return (
      <div className="empty-favorites">
        <div className="empty-icon">⭐</div>
        <p className="empty-message">还没有收藏的食物</p>
        <p className="empty-hint">在食物识别结果中点击收藏按钮添加常吃的食物</p>
      </div>
    );
  }

  return (
    <div className="favorite-foods">
      <div className="food-grid">
        {foods.map((food, index) => (
          <div key={index} className="food-card">
            <button
              className="remove-favorite"
              onClick={() => handleRemoveFromFavorite(food)}
              title="取消收藏"
            >
              ×
            </button>
            <div className="food-icon">🍽️</div>
            <div className="food-name">{food.name}</div>
            <div className="food-calories">{food.calories} kcal</div>
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

export default FavoriteFoods;
