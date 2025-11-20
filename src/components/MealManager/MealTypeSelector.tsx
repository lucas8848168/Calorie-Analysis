import React from 'react';
import { MealType } from '../../types';
import './MealTypeSelector.css';

interface MealTypeSelectorProps {
  selectedType: MealType;
  onTypeChange: (type: MealType) => void;
  showRecommendation?: boolean;
}

/**
 * 根据当前时间智能推荐餐次类型
 */
export function getRecommendedMealType(): MealType {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 10) {
    return MealType.BREAKFAST;
  } else if (hour >= 11 && hour < 14) {
    return MealType.LUNCH;
  } else if (hour >= 17 && hour < 21) {
    return MealType.DINNER;
  } else {
    return MealType.SNACK;
  }
}

const mealTypeConfig = {
  [MealType.BREAKFAST]: {
    label: '早餐',
    icon: '🌅',
    timeRange: '5:00-10:00',
    color: '#FF9800',
  },
  [MealType.LUNCH]: {
    label: '午餐',
    icon: '🌞',
    timeRange: '11:00-14:00',
    color: '#FFC107',
  },
  [MealType.DINNER]: {
    label: '晚餐',
    icon: '🌙',
    timeRange: '17:00-21:00',
    color: '#9C27B0',
  },
  [MealType.SNACK]: {
    label: '加餐',
    icon: '🍎',
    timeRange: '其他时间',
    color: '#4CAF50',
  },
};

const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  showRecommendation = true,
}) => {
  const recommendedType = getRecommendedMealType();

  return (
    <div className="meal-type-selector">
      {showRecommendation && recommendedType !== selectedType && (
        <div className="recommendation-hint">
          <span className="hint-icon">💡</span>
          <span>
            根据当前时间，推荐选择
            <strong> {mealTypeConfig[recommendedType].label}</strong>
          </span>
          <button
            className="apply-recommendation"
            onClick={() => onTypeChange(recommendedType)}
          >
            应用
          </button>
        </div>
      )}

      <div className="meal-type-options">
        {Object.entries(mealTypeConfig).map(([type, config]) => {
          const isSelected = selectedType === type;
          const isRecommended = recommendedType === type;

          return (
            <button
              key={type}
              className={`meal-type-option ${isSelected ? 'selected' : ''} ${
                isRecommended ? 'recommended' : ''
              }`}
              onClick={() => onTypeChange(type as MealType)}
              style={{
                borderColor: isSelected ? config.color : undefined,
                backgroundColor: isSelected ? `${config.color}15` : undefined,
              }}
            >
              <span className="meal-icon">{config.icon}</span>
              <div className="meal-info">
                <span className="meal-label">{config.label}</span>
                <span className="meal-time">{config.timeRange}</span>
              </div>
              {isRecommended && !isSelected && (
                <span className="recommended-badge">推荐</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MealTypeSelector;
