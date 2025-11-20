import React, { useState, useEffect } from 'react';
import GoalSetup from '../components/Goal/GoalSetup';
import GoalProgress from '../components/Goal/GoalProgress';
import GoalCard from '../components/Goal/GoalCard';
import ReminderSettings from '../components/Reminder/ReminderSettings';
import { getActiveGoal, getAllGoals } from '../services/goalService';
import { UserGoal } from '../types';
import './GoalManagement.css';

type ViewMode = 'overview' | 'create' | 'reminders';

/**
 * 目标管理页面
 * 集成目标设置、进度追踪、目标卡片和提醒设置
 */
const GoalManagement: React.FC = () => {
  const [activeGoal, setActiveGoal] = useState<UserGoal | null>(null);
  const [allGoals, setAllGoals] = useState<UserGoal[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // 加载目标数据
  const loadGoals = () => {
    setIsLoading(true);
    try {
      const active = getActiveGoal();
      const all = getAllGoals();
      setActiveGoal(active);
      setAllGoals(all);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // 处理目标创建成功
  const handleGoalCreated = () => {
    loadGoals();
    setViewMode('overview');
  };

  // 处理目标状态变化
  const handleGoalStatusChange = () => {
    loadGoals();
  };

  // 处理编辑目标
  const handleEditGoal = () => {
    // TODO: 实现编辑功能
    alert('编辑功能即将推出');
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">🎯</div>
      <h2>还没有设定目标</h2>
      <p>设定一个健康目标，开始您的健康之旅吧！</p>
      <button className="btn btn-primary btn-large" onClick={() => setViewMode('create')}>
        ✨ 创建目标
      </button>
    </div>
  );

  // 渲染概览视图
  const renderOverview = () => {
    if (!activeGoal) {
      return renderEmptyState();
    }

    return (
      <div className="overview-content">
        {/* 活动目标 */}
        <section className="active-goal-section">
          <div className="section-header">
            <h2>当前目标</h2>
          </div>
          <GoalCard
            goal={activeGoal}
            onEdit={handleEditGoal}
            onStatusChange={handleGoalStatusChange}
          />
        </section>

        {/* 进度详情 */}
        <section className="progress-section">
          <div className="section-header">
            <h2>进度详情</h2>
          </div>
          <GoalProgress goal={activeGoal} />
        </section>

        {/* 历史目标 */}
        {allGoals.filter((g) => g.status !== 'active').length > 0 && (
          <section className="history-section">
            <div className="section-header">
              <h2>历史目标</h2>
            </div>
            <div className="goals-grid">
              {allGoals
                .filter((g) => g.status !== 'active')
                .map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onStatusChange={handleGoalStatusChange}
                  />
                ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  // 渲染创建视图
  const renderCreate = () => (
    <div className="create-content">
      <GoalSetup onGoalCreated={handleGoalCreated} onCancel={() => setViewMode('overview')} />
    </div>
  );

  // 渲染提醒设置视图
  const renderReminders = () => (
    <div className="reminders-content">
      <ReminderSettings />
    </div>
  );

  if (isLoading) {
    return (
      <div className="goal-management loading">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-management">
      {/* 页面头部 */}
      <header className="page-header">
        <div className="header-content">
          <h1>目标管理</h1>
          <p>设定目标，追踪进度，养成健康习惯</p>
        </div>
        <div className="header-actions">
          {activeGoal && viewMode === 'overview' && (
            <button className="btn btn-primary" onClick={() => setViewMode('create')}>
              ✨ 创建新目标
            </button>
          )}
        </div>
      </header>

      {/* 导航标签 */}
      <nav className="page-nav">
        <button
          className={`nav-tab ${viewMode === 'overview' ? 'active' : ''}`}
          onClick={() => setViewMode('overview')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">概览</span>
        </button>
        {!activeGoal && (
          <button
            className={`nav-tab ${viewMode === 'create' ? 'active' : ''}`}
            onClick={() => setViewMode('create')}
          >
            <span className="tab-icon">✨</span>
            <span className="tab-label">创建目标</span>
          </button>
        )}
        <button
          className={`nav-tab ${viewMode === 'reminders' ? 'active' : ''}`}
          onClick={() => setViewMode('reminders')}
        >
          <span className="tab-icon">🔔</span>
          <span className="tab-label">提醒设置</span>
        </button>
      </nav>

      {/* 主内容区 */}
      <main className="page-content">
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'create' && renderCreate()}
        {viewMode === 'reminders' && renderReminders()}
      </main>
    </div>
  );
};

export default GoalManagement;
