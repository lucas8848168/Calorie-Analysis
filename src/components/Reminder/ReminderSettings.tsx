import React, { useState, useEffect } from 'react';
import {
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  getNotificationPermission,
  initializeReminders,
  stopReminders,
  testNotification,
} from '../../services/reminderService';
import { ReminderSettings as ReminderSettingsType } from '../../types';
import './ReminderSettings.css';

interface ReminderSettingsProps {
  onSettingsChange?: () => void;
}

/**
 * 提醒设置组件
 * 允许用户配置用餐提醒、饮水提醒和记录提醒
 */
const ReminderSettings: React.FC<ReminderSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ReminderSettingsType>(getReminderSettings);
  const [permission, setPermission] = useState<NotificationPermission>(
    getNotificationPermission()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 检查权限状态
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  // 请求通知权限
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(getNotificationPermission());

    if (granted) {
      alert('✓ 通知权限已授予！');
    } else {
      alert('⚠️ 通知权限被拒绝。请在浏览器设置中允许通知。');
    }
  };

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveReminderSettings(settings);

      // 如果启用了提醒，重新初始化
      if (settings.enabled) {
        await initializeReminders();
      } else {
        stopReminders();
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 测试通知
  const handleTestNotification = () => {
    if (permission !== 'granted') {
      alert('请先授予通知权限');
      return;
    }
    testNotification();
  };

  // 更新主开关
  const handleToggleEnabled = (enabled: boolean) => {
    setSettings({ ...settings, enabled });
  };

  // 更新用餐提醒
  const handleMealReminderChange = (
    meal: 'breakfast' | 'lunch' | 'dinner',
    field: 'enabled' | 'time',
    value: boolean | string
  ) => {
    setSettings({
      ...settings,
      mealReminders: {
        ...settings.mealReminders,
        [meal]: {
          ...settings.mealReminders[meal],
          [field]: value,
        },
      },
    });
  };

  // 更新饮水提醒
  const handleWaterReminderChange = (
    field: 'enabled' | 'interval' | 'startTime' | 'endTime',
    value: boolean | number | string
  ) => {
    setSettings({
      ...settings,
      waterReminder: {
        ...settings.waterReminder,
        [field]: value,
      },
    });
  };

  // 更新记录提醒
  const handleRecordReminderChange = (field: 'enabled' | 'time', value: boolean | string) => {
    setSettings({
      ...settings,
      recordReminder: {
        ...settings.recordReminder,
        [field]: value,
      },
    });
  };

  return (
    <div className="reminder-settings">
      <div className="settings-header">
        <h2>提醒设置</h2>
        <p>配置定时提醒，帮助您养成良好的饮食习惯</p>
      </div>

      {/* 通知权限状态 */}
      <div className={`permission-status ${permission}`}>
        <div className="status-content">
          <span className="status-icon">
            {permission === 'granted' && '✓'}
            {permission === 'denied' && '✗'}
            {permission === 'default' && '?'}
          </span>
          <div className="status-text">
            <strong>通知权限：</strong>
            {permission === 'granted' && '已授予'}
            {permission === 'denied' && '已拒绝'}
            {permission === 'default' && '未设置'}
          </div>
        </div>
        {permission !== 'granted' && (
          <button className="btn btn-primary" onClick={handleRequestPermission}>
            请求权限
          </button>
        )}
        {permission === 'granted' && (
          <button className="btn btn-secondary" onClick={handleTestNotification}>
            测试通知
          </button>
        )}
      </div>

      {/* 主开关 */}
      <div className="main-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            disabled={permission !== 'granted'}
          />
          <span className="toggle-switch" />
          <span className="toggle-text">启用提醒功能</span>
        </label>
      </div>

      {/* 用餐提醒 */}
      <div className={`settings-section ${!settings.enabled ? 'disabled' : ''}`}>
        <h3>🍽️ 用餐提醒</h3>
        <p className="section-description">在设定的时间提醒您记录饮食</p>

        <div className="reminder-item">
          <div className="reminder-header">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.mealReminders.breakfast.enabled}
                onChange={(e) =>
                  handleMealReminderChange('breakfast', 'enabled', e.target.checked)
                }
                disabled={!settings.enabled}
              />
              <span className="toggle-switch" />
              <span className="toggle-text">🌅 早餐提醒</span>
            </label>
          </div>
          <div className="reminder-time">
            <label htmlFor="breakfast-time">提醒时间：</label>
            <input
              id="breakfast-time"
              type="time"
              value={settings.mealReminders.breakfast.time}
              onChange={(e) => handleMealReminderChange('breakfast', 'time', e.target.value)}
              disabled={!settings.enabled || !settings.mealReminders.breakfast.enabled}
            />
          </div>
        </div>

        <div className="reminder-item">
          <div className="reminder-header">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.mealReminders.lunch.enabled}
                onChange={(e) => handleMealReminderChange('lunch', 'enabled', e.target.checked)}
                disabled={!settings.enabled}
              />
              <span className="toggle-switch" />
              <span className="toggle-text">🌞 午餐提醒</span>
            </label>
          </div>
          <div className="reminder-time">
            <label htmlFor="lunch-time">提醒时间：</label>
            <input
              id="lunch-time"
              type="time"
              value={settings.mealReminders.lunch.time}
              onChange={(e) => handleMealReminderChange('lunch', 'time', e.target.value)}
              disabled={!settings.enabled || !settings.mealReminders.lunch.enabled}
            />
          </div>
        </div>

        <div className="reminder-item">
          <div className="reminder-header">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.mealReminders.dinner.enabled}
                onChange={(e) => handleMealReminderChange('dinner', 'enabled', e.target.checked)}
                disabled={!settings.enabled}
              />
              <span className="toggle-switch" />
              <span className="toggle-text">🌙 晚餐提醒</span>
            </label>
          </div>
          <div className="reminder-time">
            <label htmlFor="dinner-time">提醒时间：</label>
            <input
              id="dinner-time"
              type="time"
              value={settings.mealReminders.dinner.time}
              onChange={(e) => handleMealReminderChange('dinner', 'time', e.target.value)}
              disabled={!settings.enabled || !settings.mealReminders.dinner.enabled}
            />
          </div>
        </div>
      </div>

      {/* 饮水提醒 */}
      <div className={`settings-section ${!settings.enabled ? 'disabled' : ''}`}>
        <h3>💧 饮水提醒</h3>
        <p className="section-description">定时提醒您补充水分</p>

        <div className="reminder-item">
          <div className="reminder-header">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.waterReminder.enabled}
                onChange={(e) => handleWaterReminderChange('enabled', e.target.checked)}
                disabled={!settings.enabled}
              />
              <span className="toggle-switch" />
              <span className="toggle-text">启用饮水提醒</span>
            </label>
          </div>

          <div className="water-settings">
            <div className="input-group">
              <label htmlFor="water-interval">提醒间隔（分钟）：</label>
              <input
                id="water-interval"
                type="number"
                min="15"
                max="180"
                step="15"
                value={settings.waterReminder.interval}
                onChange={(e) =>
                  handleWaterReminderChange('interval', parseInt(e.target.value))
                }
                disabled={!settings.enabled || !settings.waterReminder.enabled}
              />
            </div>

            <div className="time-range">
              <div className="input-group">
                <label htmlFor="water-start">开始时间：</label>
                <input
                  id="water-start"
                  type="time"
                  value={settings.waterReminder.startTime}
                  onChange={(e) => handleWaterReminderChange('startTime', e.target.value)}
                  disabled={!settings.enabled || !settings.waterReminder.enabled}
                />
              </div>
              <span className="time-separator">-</span>
              <div className="input-group">
                <label htmlFor="water-end">结束时间：</label>
                <input
                  id="water-end"
                  type="time"
                  value={settings.waterReminder.endTime}
                  onChange={(e) => handleWaterReminderChange('endTime', e.target.value)}
                  disabled={!settings.enabled || !settings.waterReminder.enabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 记录提醒 */}
      <div className={`settings-section ${!settings.enabled ? 'disabled' : ''}`}>
        <h3>📝 记录提醒</h3>
        <p className="section-description">每日定时提醒您记录饮食情况</p>

        <div className="reminder-item">
          <div className="reminder-header">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.recordReminder.enabled}
                onChange={(e) => handleRecordReminderChange('enabled', e.target.checked)}
                disabled={!settings.enabled}
              />
              <span className="toggle-switch" />
              <span className="toggle-text">启用记录提醒</span>
            </label>
          </div>
          <div className="reminder-time">
            <label htmlFor="record-time">提醒时间：</label>
            <input
              id="record-time"
              type="time"
              value={settings.recordReminder.time}
              onChange={(e) => handleRecordReminderChange('time', e.target.value)}
              disabled={!settings.enabled || !settings.recordReminder.enabled}
            />
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="settings-actions">
        <button
          className="btn btn-primary btn-large"
          onClick={handleSave}
          disabled={isSaving || permission !== 'granted'}
        >
          {isSaving ? '保存中...' : '✓ 保存设置'}
        </button>
      </div>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="success-message">
          ✓ 设置已保存并生效
        </div>
      )}
    </div>
  );
};

export default ReminderSettings;
