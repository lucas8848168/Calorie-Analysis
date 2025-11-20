import React, { useState, useEffect } from 'react';
import {
  CalorieTrendChart,
  NutritionRadarChart,
  MealDistributionChart,
  TimePeriodSelector,
  TimePeriod,
} from '../components/Charts';
import {
  getWeekViewData,
  getMonthViewData,
  getDayViewData,
  getDataSummary,
  calculateAverageNutrition,
} from '../services/chartDataService';
import { getMealsByDateRange } from '../services/mealService';
import { ChartDataPoint, MacroNutrition, MealType } from '../types';
import './DataAnalysis.css';

/**
 * 数据分析页面
 * 集成所有图表组件，提供完整的数据可视化和分析功能
 */
const DataAnalysis: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 默认目标值
  const defaultGoal = {
    dailyCalories: 2000,
    nutrition: {
      protein: 50,
      fat: 65,
      carbs: 275,
      fiber: 25,
    },
  };

  // 加载数据
  useEffect(() => {
    loadData();
  }, [timePeriod]);

  const loadData = () => {
    setIsLoading(true);

    try {
      let data: ChartDataPoint[];

      switch (timePeriod) {
        case 'day':
          data = getDayViewData(new Date());
          break;
        case 'week':
          data = getWeekViewData();
          break;
        case 'month':
          data = getMonthViewData();
          break;
        default:
          data = getWeekViewData();
      }

      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算数据摘要
  const getSummary = () => {
    if (chartData.length === 0) {
      return {
        totalDays: 0,
        totalMeals: 0,
        totalCalories: 0,
        averageDailyCalories: 0,
        averageNutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 },
        mealDistribution: {
          [MealType.BREAKFAST]: 0,
          [MealType.LUNCH]: 0,
          [MealType.DINNER]: 0,
          [MealType.SNACK]: 0,
        },
      };
    }

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    return getDataSummary(startDate, endDate);
  };

  // 获取实际营养摄入
  const getActualNutrition = (): MacroNutrition => {
    if (chartData.length === 0) {
      return { protein: 0, fat: 0, carbs: 0, fiber: 0 };
    }

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    const meals = getMealsByDateRange(startDate, endDate);

    return calculateAverageNutrition(meals, chartData.length);
  };

  // 获取所有餐次
  const getAllMeals = () => {
    if (chartData.length === 0) return [];

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;
    return getMealsByDateRange(startDate, endDate);
  };

  // 处理餐次点击
  const handleMealTypeClick = (mealType: MealType) => {
    console.log('Clicked meal type:', mealType);
    // 可以在这里导航到餐次详情或筛选数据
  };

  const summary = getSummary();
  const actualNutrition = getActualNutrition();
  const allMeals = getAllMeals();

  return (
    <div className="data-analysis-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📊 数据分析</h1>
          <p className="page-subtitle">深入了解您的饮食习惯和营养摄入</p>
        </div>
      </div>

      {/* 时间维度选择器 */}
      <div className="time-selector-section">
        <TimePeriodSelector selectedPeriod={timePeriod} onPeriodChange={setTimePeriod} />
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>加载数据中...</p>
        </div>
      ) : chartData.length === 0 || summary.totalMeals === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>暂无数据</h3>
          <p>开始记录您的饮食，查看详细的数据分析</p>
        </div>
      ) : (
        <>
          {/* 数据摘要卡片 */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">🔥</div>
              <div className="card-content">
                <div className="card-label">平均每日卡路里</div>
                <div className="card-value">{summary.averageDailyCalories}</div>
                <div className="card-unit">kcal</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">🍽️</div>
              <div className="card-content">
                <div className="card-label">总餐次</div>
                <div className="card-value">{summary.totalMeals}</div>
                <div className="card-unit">次</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <div className="card-label">记录天数</div>
                <div className="card-value">{summary.totalDays}</div>
                <div className="card-unit">天</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">💯</div>
              <div className="card-content">
                <div className="card-label">总卡路里</div>
                <div className="card-value">
                  {Math.round(summary.totalCalories / 1000)}k
                </div>
                <div className="card-unit">kcal</div>
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="charts-grid">
            {/* 卡路里趋势图 */}
            <div className="chart-container full-width">
              <CalorieTrendChart
                data={chartData}
                goalLine={defaultGoal.dailyCalories}
                timePeriod={timePeriod}
              />
            </div>

            {/* 营养雷达图 */}
            <div className="chart-container">
              <NutritionRadarChart
                actual={actualNutrition}
                target={defaultGoal.nutrition}
              />
            </div>

            {/* 餐次分布图 */}
            <div className="chart-container">
              <MealDistributionChart meals={allMeals} onSegmentClick={handleMealTypeClick} />
            </div>
          </div>

          {/* 营养详情表格 */}
          <div className="nutrition-details-section">
            <h3 className="section-title">营养详情对比</h3>
            <div className="nutrition-table">
              <div className="table-header">
                <div className="table-cell">营养素</div>
                <div className="table-cell">实际摄入</div>
                <div className="table-cell">目标值</div>
                <div className="table-cell">达成率</div>
              </div>
              {[
                { key: 'protein', label: '蛋白质', icon: '🥩' },
                { key: 'fat', label: '脂肪', icon: '🥑' },
                { key: 'carbs', label: '碳水化合物', icon: '🍚' },
                { key: 'fiber', label: '膳食纤维', icon: '🌾' },
              ].map((item) => {
                const actual = actualNutrition[item.key as keyof MacroNutrition];
                const target = defaultGoal.nutrition[item.key as keyof MacroNutrition];
                const percentage = target > 0 ? Math.round((actual / target) * 100) : 0;
                const status =
                  percentage >= 80 && percentage <= 120
                    ? 'good'
                    : percentage < 80
                    ? 'low'
                    : 'high';

                return (
                  <div key={item.key} className="table-row">
                    <div className="table-cell">
                      <span className="nutrient-icon">{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="table-cell">
                      <strong>{actual.toFixed(1)}g</strong>
                    </div>
                    <div className="table-cell">{target}g</div>
                    <div className="table-cell">
                      <span className={`percentage-badge ${status}`}>{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataAnalysis;
