import React, { useState, useEffect } from 'react';
import { MealRecord, MealType } from '../../types';
import { getMealsByDate, getMealStats } from '../../services/mealService';
import MealCard from './MealCard';
import './MealTimeline.css';

interface MealTimelineProps {
  date: Date;
  onDateChange: (date: Date) => void;
  dailyCalorieGoal?: number;
}

const MealTimeline: React.FC<MealTimelineProps> = ({
  date,
  onDateChange,
  dailyCalorieGoal = 2000,
}) => {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalCalories: 0,
    mealCount: 0,
  });

  // 加载餐次数据
  useEffect(() => {
    loadMeals();
  }, [date]);

  const loadMeals = () => {
    const dayMeals = getMealsByDate(date);
    setMeals(dayMeals);

    const dayStats = getMealStats(date);
    setStats({
      totalCalories: dayStats.totalCalories,
      mealCount: dayStats.mealCount,
    });
  };

  // 按餐次类型分组
  const groupedMeals = {
    [MealType.BREAKFAST]: meals.filter((m) => m.mealType === MealType.BREAKFAST),
    [MealType.LUNCH]: meals.filter((m) => m.mealType === MealType.LUNCH),
    [MealType.DINNER]: meals.filter((m) => m.mealType === MealType.DINNER),
    [MealType.SNACK]: meals.filter((m) => m.mealType === MealType.SNACK),
  };

  const progress = Math.min((stats.totalCalories / dailyCalorieGoal) * 100, 100);
  const remaining = Math.max(dailyCalorieGoal - stats.totalCalories, 0);

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const toggleMealExpand = (mealId: string) => {
    setExpandedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const isToday = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}年${month}月${day}日`;
  };

  return (
    <div className="meal-timeline">
      {/* 日期选择器 */}
      <div className="date-selector">
        <button className="nav-button" onClick={handlePrevDay}>
          ‹
        </button>
        <div className="date-display">
          <span className="date-icon">📅</span>
          <span className="date-text">{formatDate(date)}</span>
          {!isToday() && (
            <button className="today-button" onClick={handleToday}>
              今天
            </button>
          )}
        </div>
        <button className="nav-button" onClick={handleNextDay}>
          ›
        </button>
      </div>

      {/* 每日目标和进度 */}
      <div className="daily-progress">
        <div className="progress-header">
          <div className="progress-info">
            <span className="label">目标:</span>
            <span className="value">{dailyCalorieGoal} kcal</span>
          </div>
          <div className="progress-info">
            <span className="label">已摄入:</span>
            <span className="value consumed">
              {stats.totalCalories} kcal ({Math.round(progress)}%)
            </span>
          </div>
          <div className="progress-info">
            <span className="label">剩余:</span>
            <span className="value remaining">{remaining} kcal</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${progress > 100 ? 'over-limit' : ''}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* 餐次时间轴 */}
      <div className="meals-container">
        {Object.entries(groupedMeals).map(([type, typeMeals]) => {
          const mealTypeConfig = {
            [MealType.BREAKFAST]: { label: '早餐', icon: '🌅', time: '7:30' },
            [MealType.LUNCH]: { label: '午餐', icon: '🌞', time: '12:15' },
            [MealType.DINNER]: { label: '晚餐', icon: '🌙', time: '18:30' },
            [MealType.SNACK]: { label: '加餐', icon: '🍎', time: '' },
          };

          const config = mealTypeConfig[type as MealType];
          const hasMeals = typeMeals.length > 0;

          return (
            <div key={type} className="meal-section">
              <div className="meal-section-header">
                <span className="meal-icon">{config.icon}</span>
                <span className="meal-label">{config.label}</span>
                {hasMeals && (
                  <span className="meal-count">({typeMeals.length})</span>
                )}
              </div>

              {hasMeals ? (
                <div className="meal-cards">
                  {typeMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      isExpanded={expandedMeals.has(meal.id)}
                      onToggleExpand={() => toggleMealExpand(meal.id)}
                      onDelete={loadMeals}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-meal">
                  <button className="add-meal-button">
                    + 添加{config.label}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 空状态 */}
      {meals.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <p className="empty-message">今天还没有记录任何饮食</p>
          <p className="empty-hint">点击上方"添加"按钮开始记录</p>
        </div>
      )}
    </div>
  );
};

export default MealTimeline;
