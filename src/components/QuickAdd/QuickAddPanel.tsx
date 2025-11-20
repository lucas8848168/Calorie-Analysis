import React, { useState, useEffect } from 'react';
import { FoodItem, MealType } from '../../types';
import { getFavoritesSortedByFrequency, getRecentFoods } from '../../services/favoriteService';
import FavoriteFoods from './FavoriteFoods';
import RecentFoods from './RecentFoods';
import './QuickAddPanel.css';

interface QuickAddPanelProps {
  targetMealType: MealType;
  onFoodAdded: (food: FoodItem) => void;
}

const QuickAddPanel: React.FC<QuickAddPanelProps> = ({
  targetMealType,
  onFoodAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // 加载收藏食物
    const favs = getFavoritesSortedByFrequency();
    setFavorites(favs.map((fav) => fav.foodItem));

    // 加载最近食用
    const recent = getRecentFoods(7);
    setRecentFoods(recent);
  };

  const handleFoodAdd = (food: FoodItem) => {
    onFoodAdded(food);
    loadData(); // 重新加载以更新频率
  };

  const mealTypeLabels = {
    [MealType.BREAKFAST]: '早餐',
    [MealType.LUNCH]: '午餐',
    [MealType.DINNER]: '晚餐',
    [MealType.SNACK]: '加餐',
  };

  return (
    <div className="quick-add-panel">
      <div className="panel-header">
        <h3>快速添加到 {mealTypeLabels[targetMealType]}</h3>
      </div>

      <div className="tab-selector">
        <button
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ⭐ 常吃食物 ({favorites.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          🕐 最近食用 ({recentFoods.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'favorites' ? (
          <FavoriteFoods foods={favorites} onFoodAdd={handleFoodAdd} onUpdate={loadData} />
        ) : (
          <RecentFoods foods={recentFoods} onFoodAdd={handleFoodAdd} />
        )}
      </div>

      <div className="panel-footer">
        <button className="action-button camera">
          📷 拍照识别
        </button>
        <button className="action-button manual">
          ✏️ 手动输入
        </button>
      </div>
    </div>
  );
};

export default QuickAddPanel;
