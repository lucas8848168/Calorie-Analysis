import { ReminderSettings } from '../types';

const STORAGE_KEY = 'reminder_settings';
const NOTIFICATION_TAG_PREFIX = 'food-calorie-reminder';

/**
 * 默认提醒设置
 */
const DEFAULT_SETTINGS: ReminderSettings = {
  userId: 'default',
  enabled: false,
  mealReminders: {
    breakfast: { enabled: false, time: '08:00' },
    lunch: { enabled: false, time: '12:00' },
    dinner: { enabled: false, time: '18:00' },
  },
  waterReminder: {
    enabled: false,
    interval: 60, // 60分钟
    startTime: '09:00',
    endTime: '21:00',
  },
  recordReminder: {
    enabled: false,
    time: '21:00',
  },
};

/**
 * 检查浏览器是否支持通知
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * 获取当前通知权限状态
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission was previously denied');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

/**
 * 从 LocalStorage 获取提醒设置
 */
export function getReminderSettings(): ReminderSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_SETTINGS;

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load reminder settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 保存提醒设置到 LocalStorage
 */
export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save reminder settings:', error);
    throw new Error('保存提醒设置失败');
  }
}

/**
 * 更新提醒设置
 */
export function updateReminderSettings(
  updates: Partial<ReminderSettings>
): ReminderSettings {
  const currentSettings = getReminderSettings();
  const newSettings = {
    ...currentSettings,
    ...updates,
  };
  saveReminderSettings(newSettings);
  return newSettings;
}

/**
 * 发送浏览器通知
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions & { onClick?: () => void }
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const { onClick, ...notificationOptions } = options || {};

    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `${NOTIFICATION_TAG_PREFIX}-${Date.now()}`,
      requireInteraction: false,
      ...notificationOptions,
    });

    // 处理点击事件
    if (onClick) {
      notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
      };
    } else {
      // 默认行为：聚焦窗口
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

/**
 * 发送用餐提醒
 */
export function sendMealReminder(
  mealType: 'breakfast' | 'lunch' | 'dinner'
): Notification | null {
  const mealNames = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
  };

  const mealEmojis = {
    breakfast: '🌅',
    lunch: '🌞',
    dinner: '🌙',
  };

  return sendNotification(`${mealEmojis[mealType]} ${mealNames[mealType]}时间到了`, {
    body: '记得记录您的饮食哦！',
    tag: `${NOTIFICATION_TAG_PREFIX}-meal-${mealType}`,
    onClick: () => {
      // 导航到主页面
      window.location.hash = '#/';
    },
  });
}

/**
 * 发送饮水提醒
 */
export function sendWaterReminder(): Notification | null {
  return sendNotification('💧 该喝水了', {
    body: '保持水分摄入对健康很重要！',
    tag: `${NOTIFICATION_TAG_PREFIX}-water`,
    onClick: () => {
      window.location.hash = '#/';
    },
  });
}

/**
 * 发送记录提醒
 */
export function sendRecordReminder(): Notification | null {
  return sendNotification('📝 记录今日饮食', {
    body: '别忘了记录今天的饮食情况！',
    tag: `${NOTIFICATION_TAG_PREFIX}-record`,
    onClick: () => {
      window.location.hash = '#/';
    },
  });
}

/**
 * 解析时间字符串为分钟数
 */
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * 获取当前时间的分钟数
 */
function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * 计算距离目标时间的毫秒数
 */
function getMillisecondsUntilTime(targetTime: string): number {
  const now = new Date();
  const [hours, minutes] = targetTime.split(':').map(Number);

  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // 如果目标时间已过，设置为明天
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

/**
 * 检查当前时间是否在指定范围内
 */
function isTimeInRange(startTime: string, endTime: string): boolean {
  const currentMinutes = getCurrentMinutes();
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// 定时器存储
const timers: Map<string, number> = new Map();

/**
 * 清除所有定时器
 */
export function clearAllTimers(): void {
  timers.forEach((timerId) => {
    clearTimeout(timerId);
  });
  timers.clear();
}

/**
 * 调度用餐提醒
 */
function scheduleMealReminder(
  mealType: 'breakfast' | 'lunch' | 'dinner',
  time: string
): void {
  const timerKey = `meal-${mealType}`;

  // 清除现有定时器
  if (timers.has(timerKey)) {
    clearTimeout(timers.get(timerKey)!);
  }

  const delay = getMillisecondsUntilTime(time);

  const timerId = window.setTimeout(() => {
    sendMealReminder(mealType);
    // 重新调度明天的提醒
    scheduleMealReminder(mealType, time);
  }, delay);

  timers.set(timerKey, timerId);
}

/**
 * 调度饮水提醒
 */
function scheduleWaterReminder(interval: number, startTime: string, endTime: string): void {
  const timerKey = 'water';

  // 清除现有定时器
  if (timers.has(timerKey)) {
    clearTimeout(timers.get(timerKey)!);
  }

  const scheduleNext = () => {
    if (isTimeInRange(startTime, endTime)) {
      sendWaterReminder();
    }

    // 调度下一次提醒
    const timerId = window.setTimeout(scheduleNext, interval * 60 * 1000);
    timers.set(timerKey, timerId);
  };

  // 立即检查并调度
  scheduleNext();
}

/**
 * 调度记录提醒
 */
function scheduleRecordReminder(time: string): void {
  const timerKey = 'record';

  // 清除现有定时器
  if (timers.has(timerKey)) {
    clearTimeout(timers.get(timerKey)!);
  }

  const delay = getMillisecondsUntilTime(time);

  const timerId = window.setTimeout(() => {
    sendRecordReminder();
    // 重新调度明天的提醒
    scheduleRecordReminder(time);
  }, delay);

  timers.set(timerKey, timerId);
}

/**
 * 初始化提醒系统
 */
export async function initializeReminders(): Promise<boolean> {
  const settings = getReminderSettings();

  if (!settings.enabled) {
    console.log('Reminders are disabled');
    return false;
  }

  // 请求通知权限
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return false;
  }

  // 清除所有现有定时器
  clearAllTimers();

  // 调度用餐提醒
  if (settings.mealReminders.breakfast.enabled) {
    scheduleMealReminder('breakfast', settings.mealReminders.breakfast.time);
  }
  if (settings.mealReminders.lunch.enabled) {
    scheduleMealReminder('lunch', settings.mealReminders.lunch.time);
  }
  if (settings.mealReminders.dinner.enabled) {
    scheduleMealReminder('dinner', settings.mealReminders.dinner.time);
  }

  // 调度饮水提醒
  if (settings.waterReminder.enabled) {
    scheduleWaterReminder(
      settings.waterReminder.interval,
      settings.waterReminder.startTime,
      settings.waterReminder.endTime
    );
  }

  // 调度记录提醒
  if (settings.recordReminder.enabled) {
    scheduleRecordReminder(settings.recordReminder.time);
  }

  console.log('Reminders initialized successfully');
  return true;
}

/**
 * 停止所有提醒
 */
export function stopReminders(): void {
  clearAllTimers();
  console.log('All reminders stopped');
}

/**
 * 启用提醒
 */
export async function enableReminders(): Promise<boolean> {
  const settings = getReminderSettings();
  settings.enabled = true;
  saveReminderSettings(settings);

  return await initializeReminders();
}

/**
 * 禁用提醒
 */
export function disableReminders(): void {
  const settings = getReminderSettings();
  settings.enabled = false;
  saveReminderSettings(settings);

  stopReminders();
}

/**
 * 测试通知（用于调试）
 */
export function testNotification(): Notification | null {
  return sendNotification('🔔 测试通知', {
    body: '如果您看到这条消息，说明通知功能正常工作！',
    tag: `${NOTIFICATION_TAG_PREFIX}-test`,
  });
}
