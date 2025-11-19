import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  type?: 'no-food' | 'unclear' | 'not-food' | 'no-history';
  onAction?: () => void;
  actionText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-food',
  onAction,
  actionText = '重新上传',
}) => {
  const getContent = () => {
    switch (type) {
      case 'unclear':
        return {
          icon: '🔍',
          title: '图片不够清晰',
          description: '请重新上传清晰的食物图片，确保光线充足、食物清晰可见',
          tips: [
            '💡 尽量在光线充足的环境下拍摄',
            '📸 让食物占据画面的主要位置',
            '🎯 避免模糊、过暗或过曝的照片',
          ],
        };
      case 'not-food':
        return {
          icon: '🍽️',
          title: '这不是食物图片',
          description: '请上传包含食物的图片，我们的 AI 会帮您分析营养成分',
          tips: [
            '🥗 支持识别各类食物和菜品',
            '🍱 可以是单个食物或整餐',
            '📱 建议拍摄真实的食物照片',
          ],
        };
      case 'no-history':
        return {
          icon: '📊',
          title: '还没有分析记录',
          description: '上传您的第一张食物图片，开始健康饮食管理之旅',
          tips: [
            '📸 拍摄或上传食物图片',
            '🤖 AI 自动识别营养成分',
            '📈 追踪您的饮食数据',
          ],
        };
      default:
        return {
          icon: '🍴',
          title: '未检测到食物',
          description: '请尝试上传包含食物的清晰图片',
          tips: [
            '✨ 支持识别 1000+ 种食物',
            '⚡ 分析速度快，准确度高',
            '🎯 提供详细的营养成分数据',
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div className="empty-state animate-fadeIn">
      <div className="empty-state-icon">{content.icon}</div>
      <h3 className="empty-state-title">{content.title}</h3>
      <p className="empty-state-description">{content.description}</p>
      
      <div className="empty-state-tips">
        {content.tips.map((tip, index) => (
          <div key={index} className="tip-item">
            {tip}
          </div>
        ))}
      </div>

      {onAction && (
        <button onClick={onAction} className="btn btn-primary btn-lg mt-lg">
          {actionText}
        </button>
      )}

      {type !== 'no-history' && (
        <div className="empty-state-example">
          <p className="example-label">示例图片：</p>
          <div className="example-images">
            <div className="example-image">🍕</div>
            <div className="example-image">🥗</div>
            <div className="example-image">🍱</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
