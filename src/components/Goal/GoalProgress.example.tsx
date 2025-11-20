import React from 'react';
import GoalProgress from './GoalProgress';
import { UserGoal, GoalType } from '../../types';

/**
 * GoalProgress 组件示例
 * 展示不同进度状态的目标
 */
const GoalProgressExample: React.FC = () => {
  // 示例目标 - 刚开始（10%）
  const startingGoal: UserGoal = {
    id: 'goal_1',
    userId: 'user_1',
    type: GoalType.WEIGHT_LOSS,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45天后
    currentWeight: 75,
    targetWeight: 70,
    dailyCalorieGoal: 1800,
    macroGoals: {
      protein: 90,
      fat: 50,
      carbs: 200,
      fiber: 25,
    },
    progress: 10,
    status: 'active',
  };

  // 示例目标 - 进展良好（50%）
  const goodProgressGoal: UserGoal = {
    id: 'goal_2',
    userId: 'user_1',
    type: GoalType.MUSCLE_GAIN,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
    currentWeight: 70,
    targetWeight: 75,
    dailyCalorieGoal: 2500,
    macroGoals: {
      protein: 150,
      fat: 70,
      carbs: 300,
      fiber: 30,
    },
    progress: 50,
    status: 'active',
  };

  // 示例目标 - 进展优秀（80%）
  const excellentProgressGoal: UserGoal = {
    id: 'goal_3',
    userId: 'user_1',
    type: GoalType.HEALTH,
    startDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80天前
    targetDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20天后
    dailyCalorieGoal: 2000,
    macroGoals: {
      protein: 100,
      fat: 60,
      carbs: 250,
      fiber: 28,
    },
    progress: 80,
    status: 'active',
  };

  // 示例目标 - 已完成（100%）
  const completedGoal: UserGoal = {
    id: 'goal_4',
    userId: 'user_1',
    type: GoalType.MAINTAIN,
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90天前
    targetDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 昨天
    dailyCalorieGoal: 2200,
    macroGoals: {
      protein: 110,
      fat: 65,
      carbs: 270,
      fiber: 30,
    },
    progress: 100,
    status: 'completed',
  };

  return (
    <div style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '32px', color: '#1f2937' }}>
        GoalProgress 组件示例
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '16px', color: '#4b5563' }}>
            刚刚开始 (10%)
          </h2>
          <GoalProgress goal={startingGoal} />
        </div>

        <div>
          <h2 style={{ marginBottom: '16px', color: '#4b5563' }}>
            进展良好 (50%)
          </h2>
          <GoalProgress goal={goodProgressGoal} />
        </div>

        <div>
          <h2 style={{ marginBottom: '16px', color: '#4b5563' }}>
            进展优秀 (80%)
          </h2>
          <GoalProgress goal={excellentProgressGoal} />
        </div>

        <div>
          <h2 style={{ marginBottom: '16px', color: '#4b5563' }}>
            已完成 (100%)
          </h2>
          <GoalProgress goal={completedGoal} />
        </div>
      </div>
    </div>
  );
};

export default GoalProgressExample;
