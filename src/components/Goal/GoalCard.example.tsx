import React, { useState } from 'react';
import GoalCard from './GoalCard';
import { UserGoal, GoalType } from '../../types';

/**
 * GoalCard 组件示例
 * 展示不同类型和状态的目标卡片
 */
const GoalCardExample: React.FC = () => {
  const [goals] = useState<UserGoal[]>([
    {
      id: 'goal_1',
      userId: 'user_1',
      type: GoalType.WEIGHT_LOSS,
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      currentWeight: 75,
      targetWeight: 70,
      dailyCalorieGoal: 1800,
      macroGoals: {
        protein: 90,
        fat: 50,
        carbs: 200,
        fiber: 25,
      },
      progress: 11,
      status: 'active',
    },
    {
      id: 'goal_2',
      userId: 'user_1',
      type: GoalType.MUSCLE_GAIN,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      currentWeight: 70,
      targetWeight: 75,
      dailyCalorieGoal: 2500,
      macroGoals: {
        protein: 150,
        fat: 70,
        carbs: 300,
        fiber: 30,
      },
      progress: 33,
      status: 'paused',
    },
    {
      id: 'goal_3',
      userId: 'user_1',
      type: GoalType.HEALTH,
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
      dailyCalorieGoal: 2000,
      macroGoals: {
        protein: 100,
        fat: 60,
        carbs: 250,
        fiber: 28,
      },
      progress: 22,
      status: 'active',
    },
    {
      id: 'goal_4',
      userId: 'user_1',
      type: GoalType.MAINTAIN,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      dailyCalorieGoal: 2200,
      macroGoals: {
        protein: 110,
        fat: 65,
        carbs: 270,
        fiber: 30,
      },
      progress: 17,
      status: 'active',
    },
  ]);

  const handleEdit = (goalId: string) => {
    console.log('Edit goal:', goalId);
    alert(`编辑目标: ${goalId}`);
  };

  const handleStatusChange = () => {
    console.log('Goal status changed, refreshing...');
    // 在实际应用中，这里会重新加载目标数据
  };

  return (
    <div style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '32px', color: '#1f2937' }}>
        GoalCard 组件示例
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        }}
      >
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={() => handleEdit(goal.id)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <div style={{ marginTop: '48px', padding: '24px', background: 'white', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '16px', color: '#1f2937' }}>功能说明</h2>
        <ul style={{ color: '#4b5563', lineHeight: '1.8' }}>
          <li>
            <strong>目标类型徽章：</strong>显示目标类型（减重、增肌、维持、健康）和对应图标
          </li>
          <li>
            <strong>体重信息：</strong>显示当前体重和目标体重（仅减重和增肌目标）
          </li>
          <li>
            <strong>连续达标徽章：</strong>当连续达标3天或以上时显示，带火焰动画
          </li>
          <li>
            <strong>今日达成情况：</strong>显示今日卡路里摄入进度和达标状态
          </li>
          <li>
            <strong>营养素对比：</strong>显示蛋白质、脂肪、碳水、纤维的实际摄入vs目标值
          </li>
          <li>
            <strong>编辑按钮：</strong>点击可编辑目标设置
          </li>
          <li>
            <strong>暂停/恢复按钮：</strong>可暂停或恢复目标追踪
          </li>
          <li>
            <strong>暂停状态：</strong>暂停的目标会显示半透明遮罩和"已暂停"标签
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', borderRadius: '12px' }}>
        <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
          💡 <strong>提示：</strong>此示例使用模拟数据。在实际应用中，组件会从 mealService 读取今日餐次数据来计算实际摄入量。
        </p>
      </div>
    </div>
  );
};

export default GoalCardExample;
