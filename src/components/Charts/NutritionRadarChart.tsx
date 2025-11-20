import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { NutritionRadarChartProps } from '../../types';
import './NutritionRadarChart.css';

/**
 * 自定义Tooltip组件
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="nutrition-tooltip">
        <p className="tooltip-title">{payload[0].payload.subject}</p>
        <div className="tooltip-values">
          <div className="tooltip-row actual">
            <span className="dot"></span>
            <span>实际: {payload[0].value}g</span>
          </div>
          <div className="tooltip-row target">
            <span className="dot"></span>
            <span>目标: {payload[1].value}g</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * 营养雷达图组件
 * 显示蛋白质、脂肪、碳水化合物、膳食纤维四个维度
 * 对比实际摄入值和目标值
 */
const NutritionRadarChart: React.FC<NutritionRadarChartProps> = ({
  actual,
  target,
}) => {
  // 准备雷达图数据
  const radarData = [
    {
      subject: '蛋白质',
      actual: Math.round(actual.protein * 10) / 10,
      target: Math.round(target.protein * 10) / 10,
      fullMark: Math.max(actual.protein, target.protein) * 1.2,
    },
    {
      subject: '脂肪',
      actual: Math.round(actual.fat * 10) / 10,
      target: Math.round(target.fat * 10) / 10,
      fullMark: Math.max(actual.fat, target.fat) * 1.2,
    },
    {
      subject: '碳水',
      actual: Math.round(actual.carbs * 10) / 10,
      target: Math.round(target.carbs * 10) / 10,
      fullMark: Math.max(actual.carbs, target.carbs) * 1.2,
    },
    {
      subject: '纤维',
      actual: Math.round(actual.fiber * 10) / 10,
      target: Math.round(target.fiber * 10) / 10,
      fullMark: Math.max(actual.fiber, target.fiber) * 1.2,
    },
  ];

  // 计算营养均衡度评分（0-100）
  const calculateBalanceScore = (): number => {
    let totalScore = 0;
    let count = 0;

    Object.keys(actual).forEach((key) => {
      const actualValue = actual[key as keyof typeof actual];
      const targetValue = target[key as keyof typeof target];

      if (targetValue > 0) {
        const ratio = actualValue / targetValue;
        // 在80%-120%范围内得满分，超出范围按比例扣分
        let score = 100;
        if (ratio < 0.8) {
          score = (ratio / 0.8) * 100;
        } else if (ratio > 1.2) {
          score = Math.max(0, 100 - (ratio - 1.2) * 100);
        }
        totalScore += score;
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const balanceScore = calculateBalanceScore();

  // 根据评分确定等级和颜色
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: '#4CAF50' };
    if (score >= 75) return { level: '良好', color: '#8BC34A' };
    if (score >= 60) return { level: '一般', color: '#FFC107' };
    return { level: '需改善', color: '#FF9800' };
  };

  const scoreLevel = getScoreLevel(balanceScore);

  return (
    <div className="nutrition-radar-chart">
      <div className="chart-header">
        <h3 className="chart-title">营养均衡分析</h3>
        <div className="balance-score">
          <span className="score-label">均衡度</span>
          <span className="score-value" style={{ color: scoreLevel.color }}>
            {balanceScore}
          </span>
          <span className="score-level" style={{ color: scoreLevel.color }}>
            {scoreLevel.level}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e0e0e0" />
          
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 14, fill: '#666', fontWeight: 600 }}
          />
          
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'auto']}
            tick={{ fontSize: 12, fill: '#999' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            iconType="circle"
          />

          {/* 目标值雷达 */}
          <Radar
            name="目标值"
            dataKey="target"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.2}
            strokeWidth={2}
          />

          {/* 实际值雷达 */}
          <Radar
            name="实际值"
            dataKey="actual"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 营养详情对比 */}
      <div className="nutrition-details">
        {radarData.map((item, index) => {
          const percentage =
            item.target > 0 ? Math.round((item.actual / item.target) * 100) : 0;
          const isOver = percentage > 120;
          const isUnder = percentage < 80;

          return (
            <div key={index} className="nutrition-detail-item">
              <div className="detail-header">
                <span className="detail-name">{item.subject}</span>
                <span
                  className={`detail-percentage ${
                    isOver ? 'over' : isUnder ? 'under' : 'good'
                  }`}
                >
                  {percentage}%
                </span>
              </div>
              <div className="detail-values">
                <span className="detail-actual">{item.actual}g</span>
                <span className="detail-separator">/</span>
                <span className="detail-target">{item.target}g</span>
              </div>
              <div className="detail-bar">
                <div
                  className={`detail-bar-fill ${
                    isOver ? 'over' : isUnder ? 'under' : 'good'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 建议 */}
      <div className="nutrition-advice">
        <h4>💡 营养建议</h4>
        <ul>
          {radarData.map((item, index) => {
            const percentage =
              item.target > 0 ? (item.actual / item.target) * 100 : 0;
            if (percentage < 80) {
              return (
                <li key={index}>
                  <strong>{item.subject}</strong>摄入不足，建议增加{' '}
                  {Math.round(item.target - item.actual)}g
                </li>
              );
            } else if (percentage > 120) {
              return (
                <li key={index}>
                  <strong>{item.subject}</strong>摄入过多，建议减少{' '}
                  {Math.round(item.actual - item.target)}g
                </li>
              );
            }
            return null;
          })}
          {radarData.every(
            (item) =>
              item.target > 0 &&
              item.actual / item.target >= 0.8 &&
              item.actual / item.target <= 1.2
          ) && <li>✓ 营养摄入均衡，继续保持！</li>}
        </ul>
      </div>
    </div>
  );
};

export default NutritionRadarChart;
