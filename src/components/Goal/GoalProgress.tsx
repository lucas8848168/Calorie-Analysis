import React, { useEffect, useState } from 'react';
import { UserGoal } from '../../types';
import { getGoalStats } from '../../services/goalService';
import './GoalProgress.css';

interface GoalProgressProps {
  goal: UserGoal;
}

/**
 * 目标进度组件
 * 显示目标的进度百分比、已坚持天数、预计剩余天数
 */
const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const [stats, setStats] = useState(() => getGoalStats(goal));
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // 更新统计数据
  useEffect(() => {
    setStats(getGoalStats(goal));
  }, [goal]);

  // 进度条动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(goal.progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [goal.progress]);

  // 计算进度状态
  const getProgressStatus = () => {
    if (goal.progress >= 100) return 'completed';
    if (goal.progress >= 75) return 'excellent';
    if (goal.progress >= 50) return 'good';
    if (goal.progress >= 25) return 'fair';
    return 'starting';
  };

  const progressStatus = getProgressStatus();

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="goal-progress">
      {/* 进度百分比 */}
      <div className="progress-header">
        <div className="progress-percentage">
          <span className="percentage-value">{goal.progress}%</span>
          <span className="percentage-label">完成进度</span>
        </div>
        <div className="progress-status">
          <span className={`status-badge ${progressStatus}`}>
            {progressStatus === 'completed' && '🎉 已完成'}
            {progressStatus === 'excellent' && '💪 进展优秀'}
            {progressStatus === 'good' && '👍 进展良好'}
            {progressStatus === 'fair' && '📈 稳步前进'}
            {progressStatus === 'starting' && '🌱 刚刚开始'}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${progressStatus}`}
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="progress-bar-shine" />
          </div>
        </div>
        <div className="progress-markers">
          <span className="marker start">0%</span>
          <span className="marker quarter">25%</span>
          <span className="marker half">50%</span>
          <span className="marker three-quarter">75%</span>
          <span className="marker end">100%</span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.daysElapsed}</div>
            <div className="stat-label">已坚持天数</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.daysRemaining}</div>
            <div className="stat-label">预计剩余天数</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">总计划天数</div>
          </div>
        </div>
      </div>

      {/* 日期信息 */}
      <div className="progress-timeline">
        <div className="timeline-item">
          <span className="timeline-label">开始日期</span>
          <span className="timeline-date">{formatDate(goal.startDate)}</span>
        </div>
        <div className="timeline-arrow">→</div>
        <div className="timeline-item">
          <span className="timeline-label">目标日期</span>
          <span className="timeline-date">{formatDate(goal.targetDate)}</span>
        </div>
      </div>

      {/* 达成率信息 */}
      {stats.daysElapsed > 0 && (
        <div className="achievement-info">
          <div className="achievement-rate">
            <span className="rate-label">目标达成率</span>
            <span className={`rate-value ${stats.achievementRate >= 80 ? 'high' : stats.achievementRate >= 60 ? 'medium' : 'low'}`}>
              {stats.achievementRate}%
            </span>
          </div>
          <div className="achievement-description">
            在过去的 {stats.daysElapsed} 天中，您有 {Math.round(stats.daysElapsed * stats.achievementRate / 100)} 天达成了目标
          </div>
        </div>
      )}

      {/* 连续达标天数 */}
      {stats.consecutiveDays > 0 && (
        <div className="consecutive-days">
          <span className="consecutive-icon">🔥</span>
          <span className="consecutive-text">
            已连续达标 <strong>{stats.consecutiveDays}</strong> 天！
          </span>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
