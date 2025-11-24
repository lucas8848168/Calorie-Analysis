import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { updateUserProfile } from '../services/userService';
import './ProfileSetup.css';

interface ProfileSetupProps {
  user: User;
  onComplete: (user: User) => void;
  onSkip?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete, onSkip }) => {
  const [displayName, setDisplayName] = useState(user.profile?.displayName || '');
  const [gender, setGender] = useState<'male' | 'female' | ''>(user.profile?.gender || '');
  const [age, setAge] = useState(user.profile?.age?.toString() || '');
  const [height, setHeight] = useState(user.profile?.height?.toString() || '');
  const [weight, setWeight] = useState(user.profile?.currentWeight?.toString() || '');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'heavy' | ''>(
    user.profile?.activityLevel || ''
  );
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');

  // 计算 BMI
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (h > 0 && w > 0) {
      // BMI = 体重(kg) / 身高(m)²
      const heightInMeters = h / 100;
      const calculatedBmi = w / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
      
      // 判断 BMI 类别
      if (calculatedBmi < 18.5) {
        setBmiCategory('偏瘦');
      } else if (calculatedBmi < 24) {
        setBmiCategory('正常');
      } else if (calculatedBmi < 28) {
        setBmiCategory('偏胖');
      } else {
        setBmiCategory('肥胖');
      }
    } else {
      setBmi(null);
      setBmiCategory('');
    }
  }, [height, weight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      displayName: displayName || undefined,
      gender: gender || undefined,
      age: age ? parseInt(age) : undefined,
      height: height ? parseFloat(height) : undefined,
      currentWeight: weight ? parseFloat(weight) : undefined,
      activityLevel: activityLevel || undefined,
    };
    
    const success = updateUserProfile(updates);
    
    if (success) {
      // 重新获取更新后的用户信息
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          ...updates,
        },
      };
      onComplete(updatedUser);
    }
  };

  const getBmiColor = () => {
    if (!bmi) return '#999';
    if (bmi < 18.5) return '#ff9800';
    if (bmi < 24) return '#4caf50';
    if (bmi < 28) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="profile-setup">
      <div className="profile-setup-header">
        <h2>完善个人信息</h2>
        <p className="profile-setup-subtitle">
          设置您的基本信息，帮助我们提供更精准的健康建议
        </p>
      </div>

      <form onSubmit={handleSubmit} className="profile-setup-form">
        <div className="form-group">
          <label htmlFor="displayName">
            <span className="label-icon">👤</span>
            姓名
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="请输入您的姓名"
          />
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">⚧</span>
            性别
          </label>
          <div className="gender-selector">
            <button
              type="button"
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              <span className="gender-icon">👨</span>
              男
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              <span className="gender-icon">👩</span>
              女
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="age">
            <span className="label-icon">🎂</span>
            年龄
          </label>
          <div className="input-with-unit">
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="请输入年龄"
              min="1"
              max="150"
            />
            <span className="input-unit">岁</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="height">
            <span className="label-icon">📏</span>
            身高
          </label>
          <div className="input-with-unit">
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="请输入身高"
              min="50"
              max="250"
              step="0.1"
            />
            <span className="input-unit">cm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="weight">
            <span className="label-icon">⚖️</span>
            体重
          </label>
          <div className="input-with-unit">
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="请输入体重"
              min="20"
              max="300"
              step="0.1"
            />
            <span className="input-unit">kg</span>
          </div>
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">💼</span>
            活动水平
          </label>
          <div className="activity-selector">
            <button
              type="button"
              className={`activity-btn ${activityLevel === 'sedentary' ? 'active' : ''}`}
              onClick={() => setActivityLevel('sedentary')}
            >
              <span className="activity-icon">🪑</span>
              <span className="activity-label">久坐</span>
              <span className="activity-desc">办公室工作</span>
            </button>
            <button
              type="button"
              className={`activity-btn ${activityLevel === 'light' ? 'active' : ''}`}
              onClick={() => setActivityLevel('light')}
            >
              <span className="activity-icon">🚶</span>
              <span className="activity-label">轻度</span>
              <span className="activity-desc">轻体力工作</span>
            </button>
            <button
              type="button"
              className={`activity-btn ${activityLevel === 'moderate' ? 'active' : ''}`}
              onClick={() => setActivityLevel('moderate')}
            >
              <span className="activity-icon">🏃</span>
              <span className="activity-label">中度</span>
              <span className="activity-desc">中体力工作</span>
            </button>
            <button
              type="button"
              className={`activity-btn ${activityLevel === 'heavy' ? 'active' : ''}`}
              onClick={() => setActivityLevel('heavy')}
            >
              <span className="activity-icon">🏋️</span>
              <span className="activity-label">重度</span>
              <span className="activity-desc">重体力工作</span>
            </button>
          </div>
        </div>

        {bmi !== null && (
          <div className="bmi-display">
            <div className="bmi-label">您的 BMI 指数</div>
            <div className="bmi-value" style={{ color: getBmiColor() }}>
              {bmi.toFixed(1)}
            </div>
            <div className="bmi-category" style={{ color: getBmiColor() }}>
              {bmiCategory}
            </div>
            <div className="bmi-reference">
              <div className="bmi-ref-item">
                <span className="bmi-ref-range">{'< 18.5'}</span>
                <span className="bmi-ref-label">偏瘦</span>
              </div>
              <div className="bmi-ref-item">
                <span className="bmi-ref-range">18.5-24</span>
                <span className="bmi-ref-label">正常</span>
              </div>
              <div className="bmi-ref-item">
                <span className="bmi-ref-range">24-28</span>
                <span className="bmi-ref-label">偏胖</span>
              </div>
              <div className="bmi-ref-item">
                <span className="bmi-ref-range">{'≥ 28'}</span>
                <span className="bmi-ref-label">肥胖</span>
              </div>
            </div>
          </div>
        )}

        <div className="profile-setup-actions">
          <button type="submit" className="btn-primary">
            保存信息
          </button>
          {onSkip && (
            <button type="button" className="btn-secondary" onClick={onSkip}>
              暂时跳过
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
