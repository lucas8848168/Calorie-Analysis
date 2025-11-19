import React from 'react';
import { AnalysisDisplayProps } from '../types';
import { formatCalories, formatNutrition } from '../utils/dataParser';
import './AnalysisDisplay.css';

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  result,
  onNewAnalysis,
}) => {
  if (!result || result.foods.length === 0) {
    // 根据置信度显示不同的提示
    let message = '未检测到食物';
    let hint = '请尝试上传包含食物的清晰图片';
    
    if (result?.confidence === 'unclear') {
      message = '图片不够清晰';
      hint = '请重新上传清晰的食物图片';
    } else if (result?.confidence === 'not_food') {
      message = '这不是食物图片';
      hint = '请上传包含食物的图片';
    }
    
    return (
      <div className="analysis-display empty">
        <div className="empty-state">
          <p>{message}</p>
          <p className="hint">{hint}</p>
          <button onClick={onNewAnalysis} className="btn-primary">
            重新上传
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-display">
      <div className="result-header">
        <h2>分析结果</h2>
        {result.confidence && (
          <span className={`confidence ${result.confidence}`}>
            置信度: {result.confidence}
          </span>
        )}
      </div>

      <div className="total-calories">
        <h3>总卡路里</h3>
        <div className="calories-value">
          {formatCalories(result.totalCalories)}
        </div>
        <p className="disclaimer">
          * 基于标准份量的估算值，实际值可能有所不同
        </p>
      </div>

      <div className="foods-list">
        <h3>食物详情</h3>
        {result.foods.map((food, index) => (
          <div key={index} className="food-item">
            <div className="food-header">
              <h4>{food.name}</h4>
              <span className="food-calories">
                {formatCalories(food.calories)}
              </span>
            </div>
            
            {food.portion && (
              <div className="food-meta">
                <span className="meta-label">份量：</span>
                <span className="meta-value">{food.portion}</span>
              </div>
            )}
            
            {food.ingredients && (
              <div className="food-meta">
                <span className="meta-label">成分：</span>
                <span className="meta-value">{food.ingredients}</span>
              </div>
            )}
            
            <div className="nutrition-table">
              <div className="nutrition-row">
                <span className="nutrition-label">蛋白质</span>
                <span className="nutrition-value">
                  {formatNutrition(food.nutrition.protein)}
                </span>
              </div>
              <div className="nutrition-row">
                <span className="nutrition-label">脂肪</span>
                <span className="nutrition-value">
                  {formatNutrition(food.nutrition.fat)}
                </span>
              </div>
              <div className="nutrition-row">
                <span className="nutrition-label">碳水化合物</span>
                <span className="nutrition-value">
                  {formatNutrition(food.nutrition.carbs)}
                </span>
              </div>
              <div className="nutrition-row">
                <span className="nutrition-label">膳食纤维</span>
                <span className="nutrition-value">
                  {formatNutrition(food.nutrition.fiber)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={onNewAnalysis} className="btn-primary">
          上传新图片
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
