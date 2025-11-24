import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser } from '../services/userService';
import ProfileSetup from '../components/ProfileSetup';
import AuthModal from '../components/AuthModal';
import GoalManagement from './GoalManagement';
import './MyProfile.css';

interface MyProfileProps {
  user: User | null;
  onUserUpdate?: (user: User) => void;
}

type TabType = 'info' | 'goals';

const MyProfile: React.FC<MyProfileProps> = ({ user: initialUser, onUserUpdate }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');

  useEffect(() => {
    // 如果没有传入用户，尝试从存储获取
    if (!user) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  }, [user]);

  useEffect(() => {
    // 计算 BMI
    if (user?.profile?.height && user?.profile?.currentWeight) {
      const h = user.profile.height / 100; // 转换为米
      const w = user.profile.currentWeight;
      const calculatedBmi = w / (h * h);
      setBmi(calculatedBmi);
      
      if (calculatedBmi < 18.5) {
        setBmiCategory('偏瘦');
      } else if (calculatedBmi < 24) {
        setBmiCategory('正常');
      } else if (calculatedBmi < 28) {
        setBmiCategory('偏胖');
      } else {
        setBmiCategory('肥胖');
      }
    }
  }, [user]);

  const handleProfileComplete = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  const getBmiColor = () => {
    if (!bmi) return '#999';
    if (bmi < 18.5) return '#ff9800';
    if (bmi < 24) return '#4caf50';
    if (bmi < 28) return '#ff9800';
    return '#f44336';
  };

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setShowAuthModal(false);
    if (onUserUpdate) {
      onUserUpdate(newUser);
    }
  };

  if (!user) {
    return (
      <div className="my-profile">
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>请先登录</h3>
          <p>登录后即可查看和管理个人信息</p>
          <button
            className="login-btn-large"
            onClick={() => setShowAuthModal(true)}
          >
            登录 / 注册
          </button>
        </div>
        
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

  // 检查是否需要完善信息
  const needsProfileSetup = !user.profile?.displayName || 
                           !user.profile?.gender || 
                           !user.profile?.age || 
                           !user.profile?.height || 
                           !user.profile?.currentWeight;

  if (isEditing || needsProfileSetup) {
    return (
      <div className="my-profile">
        <ProfileSetup
          user={user}
          onComplete={handleProfileComplete}
          onSkip={needsProfileSetup ? undefined : () => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="my-profile">
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span className="tab-icon">👤</span>
          个人信息
        </button>
        <button
          className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <span className="tab-icon">🎯</span>
          健康目标
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="profile-info-section">
          {/* 用户卡片 */}
          <div className="user-card">
            <div className="user-card-header">
              <div className="user-avatar-large">
                {user.profile?.avatar ? (
                  <img src={user.profile.avatar} alt={user.username} />
                ) : (
                  <span>
                    {(user.profile?.displayName || user.username)
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="user-card-info">
                <h2>{user.profile?.displayName || user.username}</h2>
                <p className="user-email">{user.email || '未设置邮箱'}</p>
              </div>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <span>✏️</span>
                编辑
              </button>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="info-card">
            <h3 className="card-title">基本信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">⚧</span>
                <div className="info-content">
                  <div className="info-label">性别</div>
                  <div className="info-value">
                    {user.profile?.gender === 'male' ? '男' : user.profile?.gender === 'female' ? '女' : '未设置'}
                  </div>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🎂</span>
                <div className="info-content">
                  <div className="info-label">年龄</div>
                  <div className="info-value">{user.profile?.age || '-'} 岁</div>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📏</span>
                <div className="info-content">
                  <div className="info-label">身高</div>
                  <div className="info-value">{user.profile?.height || '-'} cm</div>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⚖️</span>
                <div className="info-content">
                  <div className="info-label">体重</div>
                  <div className="info-value">{user.profile?.currentWeight || '-'} kg</div>
                </div>
              </div>
            </div>
          </div>

          {/* BMI 卡片 */}
          {bmi !== null && (
            <div className="bmi-card">
              <h3 className="card-title">BMI 指数</h3>
              <div className="bmi-content">
                <div className="bmi-main">
                  <div className="bmi-value-large" style={{ color: getBmiColor() }}>
                    {bmi.toFixed(1)}
                  </div>
                  <div className="bmi-category-large" style={{ color: getBmiColor() }}>
                    {bmiCategory}
                  </div>
                </div>
                <div className="bmi-chart">
                  <div className="bmi-bar">
                    <div
                      className="bmi-indicator"
                      style={{
                        left: `${Math.min(Math.max((bmi - 15) / 20 * 100, 0), 100)}%`,
                        backgroundColor: getBmiColor(),
                      }}
                    />
                  </div>
                  <div className="bmi-labels">
                    <span>15</span>
                    <span>18.5</span>
                    <span>24</span>
                    <span>28</span>
                    <span>35</span>
                  </div>
                  <div className="bmi-categories">
                    <span className="bmi-cat-label">偏瘦</span>
                    <span className="bmi-cat-label">正常</span>
                    <span className="bmi-cat-label">偏胖</span>
                    <span className="bmi-cat-label">肥胖</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 统计信息 */}
          <div className="stats-card">
            <h3 className="card-title">使用统计</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📸</div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">分析次数</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🍽️</div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">餐次记录</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">活跃天数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="goals-section">
          <GoalManagement />
        </div>
      )}
    </div>
  );
};

export default MyProfile;
