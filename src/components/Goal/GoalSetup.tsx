import React, { useState } from 'react';
import { GoalType } from '../../types';
import { createGoal } from '../../services/goalService';
import './GoalSetup.css';

interface GoalSetupProps {
  onGoalCreated?: () => void;
  onCancel?: () => void;
}

/**
 * 目标设置组件
 * 允许用户创建新的健康目标
 */
const GoalSetup: React.FC<GoalSetupProps> = ({ onGoalCreated, onCancel }) => {
  const [goalType, setGoalType] = useState<GoalType>(GoalType.HEALTH);
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [dailyCalories, setDailyCalories] = useState('2000');
  const [protein, setProtein] = useState('50');
  const [fat, setFat] = useState('65');
  const [carbs, setCarbs] = useState('275');
  const [fiber, setFiber] = useState('25');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goalTypes = [
    {
      value: GoalType.WEIGHT_LOSS,
      label: '减重',
      icon: '📉',
      description: '减少体重，塑造健康体型',
    },
    {
      value: GoalType.MUSCLE_GAIN,
      label: '增肌',
      icon: '💪',
      description: '增加肌肉量，提升力量',
    },
    {
      value: GoalType.MAINTAIN,
      label: '维持',
      icon: '⚖️',
      description: '保持当前体重和状态',
    },
    {
      value: GoalType.HEALTH,
      label: '健康',
      icon: '🌟',
      description: '改善整体健康状况',
    },
  ];

  const needsWeightInput =
    goalType === GoalType.WEIGHT_LOSS || goalType === GoalType.MUSCLE_GAIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const goalData = {
        userId: 'default',
        type: goalType,
        startDate: new Date(startDate),
        targetDate: new Date(targetDate),
        currentWeight: needsWeightInput ? parseFloat(currentWeight) : undefined,
        targetWeight: needsWeightInput ? parseFloat(targetWeight) : undefined,
        dailyCalorieGoal: parseFloat(dailyCalories),
        macroGoals: {
          protein: parseFloat(protein),
          fat: parseFloat(fat),
          carbs: parseFloat(carbs),
          fiber: parseFloat(fiber),
        },
      };

      createGoal(goalData);

      if (onGoalCreated) {
        onGoalCreated();
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['创建目标失败，请重试']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="goal-setup">
      <div className="setup-header">
        <h2>设定健康目标</h2>
        <p>选择目标类型并设置您的健康计划</p>
      </div>

      <form onSubmit={handleSubmit} className="setup-form">
        {/* 错误提示 */}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                ⚠️ {error}
              </div>
            ))}
          </div>
        )}

        {/* 目标类型选择 */}
        <div className="form-section">
          <label className="section-label">目标类型</label>
          <div className="goal-type-grid">
            {goalTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`goal-type-card ${goalType === type.value ? 'selected' : ''}`}
                onClick={() => setGoalType(type.value)}
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-label">{type.label}</span>
                <span className="type-description">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 体重目标（仅减重和增肌） */}
        {needsWeightInput && (
          <div className="form-section">
            <label className="section-label">体重目标</label>
            <div className="weight-inputs">
              <div className="input-group">
                <label htmlFor="currentWeight">当前体重 (kg)</label>
                <input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="例如：70.5"
                  required
                />
              </div>
              <div className="input-arrow">→</div>
              <div className="input-group">
                <label htmlFor="targetWeight">目标体重 (kg)</label>
                <input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="例如：65.0"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* 日期设置 */}
        <div className="form-section">
          <label className="section-label">时间计划</label>
          <div className="date-inputs">
            <div className="input-group">
              <label htmlFor="startDate">开始日期</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="targetDate">目标日期</label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
          </div>
        </div>

        {/* 每日卡路里目标 */}
        <div className="form-section">
          <label className="section-label">每日卡路里目标</label>
          <div className="input-group">
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
              min="1000"
              max="5000"
              step="50"
              required
            />
            <span className="input-unit">kcal</span>
          </div>
          <p className="input-hint">建议范围：1200-3000 kcal</p>
        </div>

        {/* 营养目标 */}
        <div className="form-section">
          <label className="section-label">每日营养目标</label>
          <div className="nutrition-grid">
            <div className="input-group">
              <label htmlFor="protein">
                <span className="nutrient-icon">🥩</span>
                蛋白质 (g)
              </label>
              <input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="1"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="fat">
                <span className="nutrient-icon">🥑</span>
                脂肪 (g)
              </label>
              <input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="1"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="carbs">
                <span className="nutrient-icon">🍚</span>
                碳水 (g)
              </label>
              <input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="1"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="fiber">
                <span className="nutrient-icon">🌾</span>
                纤维 (g)
              </label>
              <input
                id="fiber"
                type="number"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                min="0"
                step="1"
                required
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '创建中...' : '✓ 创建目标'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GoalSetup;
