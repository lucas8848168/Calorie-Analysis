import React, { useState, useEffect } from 'react';
import { LoadingIndicatorProps } from '../types';
import './LoadingIndicator.css';

const HEALTH_TIPS = [
  '💡 每天至少摄入 5 种不同颜色的蔬果',
  '💧 建议每天饮水 1.5-2 升',
  '🥗 控制每餐热量在 500-700 千卡',
  '🏃 每天运动 30 分钟有助于健康',
  '😴 充足的睡眠有助于控制体重',
  '🥜 坚果是健康的零食选择',
  '🐟 每周吃 2-3 次鱼类有益健康',
  '🍚 粗粮应占主食的 1/3',
];

const STEPS = [
  { id: 1, label: '正在分析图片', icon: '🔍', duration: 2000 },
  { id: 2, label: '正在识别食物', icon: '🍱', duration: 3000 },
  { id: 3, label: '计算营养成分', icon: '⚖️', duration: 2000 },
  { id: 4, label: '生成健康建议', icon: '💡', duration: 1000 },
];

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  progress,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // 模拟步骤进度
  useEffect(() => {
    if (progress === undefined) {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3000);

      return () => clearInterval(stepInterval);
    }
  }, [progress]);

  // 轮播健康小贴士
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  // 模拟进度条
  useEffect(() => {
    if (progress === undefined) {
      const progressInterval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev < 95) {
            return prev + Math.random() * 5;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(progressInterval);
    }
  }, [progress]);

  const displayProgress = progress !== undefined ? progress : Math.min(simulatedProgress, 95);
  const currentStepLabel = STEPS[currentStep]?.label || '正在识别食物图片并分析营养成分';

  return (
    <div className="loading-indicator-v2">
      <div className="loading-container">
        {/* 主加载动画 */}
        <div className="loading-spinner-v2">
          <div className="spinner-ring"></div>
          <div className="spinner-icon">🍽️</div>
        </div>

        {/* 进度百分比 */}
        <div className="loading-progress-text">
          {Math.round(displayProgress)}%
        </div>

        {/* 主消息 - 与当前步骤同步 */}
        <p className="loading-message-v2">{currentStepLabel}</p>

        {/* 进度条 */}
        <div className="progress-bar-v2">
          <div
            className="progress-fill-v2"
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>

        {/* 步骤展示 */}
        <div className="loading-steps">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`step-item ${
                index <= currentStep ? 'active' : ''
              } ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              {index < currentStep && (
                <div className="step-check">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* 健康小贴士 */}
        <div className="health-tip">
          <div className="tip-content animate-fadeIn" key={currentTip}>
            {HEALTH_TIPS[currentTip]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
