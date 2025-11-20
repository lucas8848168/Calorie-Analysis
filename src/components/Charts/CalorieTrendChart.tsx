import React, { memo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CalorieTrendChartProps } from '../../types';
import { formatDateForChart } from '../../services/chartDataService';
import './CalorieTrendChart.css';

/**
 * 自定义Tooltip组件（使用memo优化）
 */
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          <span className="tooltip-icon">🔥</span>
          卡路里: <strong>{data.calories}</strong> kcal
        </p>
        {data.meals && data.meals.length > 0 && (
          <p className="tooltip-meals">
            {data.meals.length} 餐次
          </p>
        )}
      </div>
    );
  }
  return null;
});

/**
 * 卡路里趋势图组件
 * 使用折线图+柱状图组合展示每日卡路里摄入趋势
 */
const CalorieTrendChart: React.FC<CalorieTrendChartProps> = ({
  data,
  goalLine,
  timePeriod,
}) => {
  // 格式化数据用于图表显示
  const chartData = data.map((point) => ({
    ...point,
    date: formatDateForChart(point.date, timePeriod),
    calories: point.calories,
  }));

  // 处理数据点点击
  const handleDataPointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const point = data.activePayload[0].payload;
      console.log('Clicked data point:', point);
      // 可以在这里触发回调显示详细信息
    }
  };

  // 计算Y轴的最大值（向上取整到最近的100）
  const maxCalories = Math.max(...chartData.map((d) => d.calories), goalLine || 0);
  const yAxisMax = Math.ceil(maxCalories / 100) * 100 + 200;

  return (
    <div className="calorie-trend-chart">
      <div className="chart-header">
        <h3 className="chart-title">卡路里趋势</h3>
        <div className="chart-legend-custom">
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#667eea' }}></span>
            每日摄入
          </span>
          {goalLine && (
            <span className="legend-item">
              <span className="legend-color dashed" style={{ background: '#4CAF50' }}></span>
              目标线 ({goalLine} kcal)
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={chartData}
          onClick={handleDataPointClick}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#666' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          
          <YAxis
            domain={[0, yAxisMax]}
            tick={{ fontSize: 12, fill: '#666' }}
            tickLine={{ stroke: '#e0e0e0' }}
            label={{
              value: '卡路里 (kcal)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#666' },
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />
          
          <Legend
            wrapperStyle={{ display: 'none' }} // 使用自定义图例
          />

          {/* 目标线 */}
          {goalLine && (
            <ReferenceLine
              y={goalLine}
              stroke="#4CAF50"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `目标 ${goalLine}`,
                position: 'right',
                fill: '#4CAF50',
                fontSize: 12,
              }}
            />
          )}

          {/* 柱状图 */}
          <Bar
            dataKey="calories"
            fill="#667eea"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
            animationDuration={800}
          />

          {/* 折线图 */}
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#764ba2"
            strokeWidth={3}
            dot={{
              fill: '#764ba2',
              strokeWidth: 2,
              r: 5,
              stroke: '#fff',
            }}
            activeDot={{
              r: 7,
              fill: '#764ba2',
              stroke: '#fff',
              strokeWidth: 2,
            }}
            animationDuration={1000}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 数据摘要 */}
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">平均</span>
          <span className="summary-value">
            {data.length > 0
              ? Math.round(
                  data.reduce((sum, d) => sum + d.calories, 0) / data.length
                )
              : 0}{' '}
            kcal
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">最高</span>
          <span className="summary-value">
            {data.length > 0 ? Math.max(...data.map((d) => d.calories)) : 0} kcal
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">最低</span>
          <span className="summary-value">
            {data.length > 0
              ? Math.min(...data.map((d) => d.calories).filter((c) => c > 0))
              : 0}{' '}
            kcal
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">总计</span>
          <span className="summary-value">
            {data.reduce((sum, d) => sum + d.calories, 0)} kcal
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(CalorieTrendChart);
