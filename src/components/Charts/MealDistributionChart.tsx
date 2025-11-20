import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { MealDistributionChartProps, MealType } from '../../types';
import { calculateMealDistribution } from '../../services/chartDataService';
import './MealDistributionChart.css';

// 餐次类型配置
const mealTypeConfig = {
  [MealType.BREAKFAST]: {
    label: '早餐',
    icon: '🌅',
    color: '#FF9800',
  },
  [MealType.LUNCH]: {
    label: '午餐',
    icon: '🌞',
    color: '#FFC107',
  },
  [MealType.DINNER]: {
    label: '晚餐',
    icon: '🌙',
    color: '#9C27B0',
  },
  [MealType.SNACK]: {
    label: '加餐',
    icon: '🍎',
    color: '#4CAF50',
  },
};



/**
 * 自定义Tooltip
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="meal-distribution-tooltip">
        <div className="tooltip-header">
          <span className="tooltip-icon">{data.payload.icon}</span>
          <span className="tooltip-name">{data.name}</span>
        </div>
        <div className="tooltip-content">
          <div className="tooltip-row">
            <span>卡路里:</span>
            <strong>{data.value} kcal</strong>
          </div>
          <div className="tooltip-row">
            <span>占比:</span>
            <strong>{data.payload.percentage}%</strong>
          </div>
          <div className="tooltip-row">
            <span>餐次数:</span>
            <strong>{data.payload.mealCount} 次</strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * 餐次分布饼图组件
 * 显示早餐、午餐、晚餐、加餐各自的卡路里占比
 */
const MealDistributionChart: React.FC<MealDistributionChartProps> = ({
  meals,
  onSegmentClick,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // 计算餐次分布
  const distribution = calculateMealDistribution(meals);
  const totalCalories = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  // 计算每个餐次的餐次数量
  const mealCounts = {
    [MealType.BREAKFAST]: meals.filter((m) => m.mealType === MealType.BREAKFAST).length,
    [MealType.LUNCH]: meals.filter((m) => m.mealType === MealType.LUNCH).length,
    [MealType.DINNER]: meals.filter((m) => m.mealType === MealType.DINNER).length,
    [MealType.SNACK]: meals.filter((m) => m.mealType === MealType.SNACK).length,
  };

  // 准备饼图数据
  const pieData = Object.entries(MealType).map(([, mealType]) => {
    const calories = distribution[mealType];
    const percentage = totalCalories > 0 ? Math.round((calories / totalCalories) * 100) : 0;

    return {
      name: mealTypeConfig[mealType].label,
      value: calories,
      percentage,
      mealCount: mealCounts[mealType],
      color: mealTypeConfig[mealType].color,
      icon: mealTypeConfig[mealType].icon,
      mealType: mealType,
    };
  });

  // 处理扇区点击
  const handlePieClick = (data: any, index: number) => {
    setActiveIndex(index);
    if (onSegmentClick && data.mealType) {
      onSegmentClick(data.mealType);
    }
  };

  // 处理鼠标进入
  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="meal-distribution-chart">
      <div className="chart-header">
        <h3 className="chart-title">餐次分布</h3>
        <div className="total-info">
          <span className="total-label">总计</span>
          <span className="total-value">{totalCalories} kcal</span>
        </div>
      </div>

      {totalCalories === 0 ? (
        <div className="empty-chart">
          <p className="empty-icon">📊</p>
          <p className="empty-text">暂无餐次数据</p>
          <p className="empty-hint">开始记录您的饮食，查看餐次分布</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handlePieClick(entry, index)}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ display: 'none' }} // 使用自定义图例
              />
            </PieChart>
          </ResponsiveContainer>

          {/* 自定义图例 */}
          <div className="meal-legend">
            {pieData.map((item, index) => (
              <div
                key={index}
                className={`legend-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handlePieClick(item, index)}
                onMouseEnter={() => handleMouseEnter(null, index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="legend-header">
                  <span className="legend-icon">{item.icon}</span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-percentage">{item.percentage}%</span>
                </div>
                <div className="legend-details">
                  <span className="legend-calories">{item.value} kcal</span>
                  <span className="legend-count">{item.mealCount} 次</span>
                </div>
                <div className="legend-bar">
                  <div
                    className="legend-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 分析摘要 */}
          <div className="distribution-summary">
            <h4>📈 分布分析</h4>
            <div className="summary-content">
              {(() => {
                const sortedData = [...pieData].sort((a, b) => b.value - a.value);
                const highest = sortedData[0];
                const lowest = sortedData.filter((d) => d.value > 0).pop();

                return (
                  <ul>
                    {highest && highest.value > 0 && (
                      <li>
                        <strong>{highest.name}</strong>摄入最多，占比 {highest.percentage}%
                      </li>
                    )}
                    {lowest && lowest.value > 0 && lowest !== highest && (
                      <li>
                        <strong>{lowest.name}</strong>摄入最少，占比 {lowest.percentage}%
                      </li>
                    )}
                    {pieData.filter((d) => d.value === 0).length > 0 && (
                      <li>
                        {pieData
                          .filter((d) => d.value === 0)
                          .map((d) => d.name)
                          .join('、')}
                        暂无记录
                      </li>
                    )}
                    {pieData.every((d) => d.percentage >= 20 && d.percentage <= 35) && (
                      <li>✓ 餐次分布均衡，继续保持！</li>
                    )}
                  </ul>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MealDistributionChart;
