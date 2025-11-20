import React from 'react';
import './TimePeriodSelector.css';

export type TimePeriod = 'day' | 'week' | 'month';

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

/**
 * 时间维度选择器组件
 * 支持日/周/月三种时间维度切换
 */
const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods: Array<{ value: TimePeriod; label: string; icon: string; description: string }> = [
    {
      value: 'day',
      label: '日',
      icon: '📅',
      description: '查看今日数据',
    },
    {
      value: 'week',
      label: '周',
      icon: '📊',
      description: '查看最近7天',
    },
    {
      value: 'month',
      label: '月',
      icon: '📈',
      description: '查看最近30天',
    },
  ];

  return (
    <div className="time-period-selector">
      <div className="selector-label">
        <span className="label-icon">🕐</span>
        <span className="label-text">时间维度</span>
      </div>
      
      <div className="period-buttons">
        {periods.map((period) => (
          <button
            key={period.value}
            className={`period-button ${selectedPeriod === period.value ? 'active' : ''}`}
            onClick={() => onPeriodChange(period.value)}
            title={period.description}
          >
            <span className="button-icon">{period.icon}</span>
            <span className="button-label">{period.label}</span>
          </button>
        ))}
      </div>

      <div className="period-description">
        {periods.find((p) => p.value === selectedPeriod)?.description}
      </div>
    </div>
  );
};

export default TimePeriodSelector;
