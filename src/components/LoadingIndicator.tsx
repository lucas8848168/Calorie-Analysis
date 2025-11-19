import React from 'react';
import { LoadingIndicatorProps } from '../types';
import './LoadingIndicator.css';

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = '正在分析中...',
  progress,
}) => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
      {progress !== undefined && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;
