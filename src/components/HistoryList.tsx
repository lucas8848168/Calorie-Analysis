import React, { useState, useEffect } from 'react';
import { HistoryListProps, AnalysisResult } from '../types';
import { historyStorage } from '../services/historyStorage';
import { formatCalories, formatTimestamp } from '../utils/dataParser';
import './HistoryList.css';

const HistoryList: React.FC<HistoryListProps> = ({ onSelectRecord }) => {
  const [records, setRecords] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = historyStorage.getRecords();
    setRecords(allRecords);
  };

  const handleDelete = (timestamp: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm('确定要删除这条记录吗？')) {
      historyStorage.deleteRecord(timestamp);
      loadRecords();
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      historyStorage.clearAll();
      loadRecords();
    }
  };

  if (records.length === 0) {
    return (
      <div className="history-list empty">
        <p>暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      <div className="history-header">
        <h3>历史记录</h3>
        <button onClick={handleClearAll} className="btn-clear">
          清空全部
        </button>
      </div>

      <div className="history-items">
        {records.map((record) => (
          <div
            key={record.id}
            className="history-item"
            onClick={() => onSelectRecord(record)}
          >
            <div className="history-thumbnail">
              {record.imageUrl ? (
                <img src={record.imageUrl} alt="食物" />
              ) : (
                <div className="no-image">无图片</div>
              )}
            </div>

            <div className="history-info">
              <div className="history-foods">
                {record.foods.length > 0 ? (
                  record.foods.map((food, index) => (
                    <span key={index} className="food-name">
                      {food.name}
                      {index < record.foods.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span className="no-food">未检测到食物</span>
                )}
              </div>

              <div className="history-meta">
                <span className="history-calories">
                  {formatCalories(record.totalCalories)}
                </span>
                <span className="history-time">
                  {formatTimestamp(record.timestamp)}
                </span>
              </div>
            </div>

            <button
              className="btn-delete"
              onClick={(e) => handleDelete(record.timestamp, e)}
              title="删除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
