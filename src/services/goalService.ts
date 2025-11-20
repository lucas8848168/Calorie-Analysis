import { UserGoal, GoalType } from '../types';
import { getMealsByDateRange } from './mealService';

const STORAGE_KEY = 'goals';

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 从 LocalStorage 获取所有目标
 */
function getGoalsFromStorage(): UserGoal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const goals = JSON.parse(data);
    return goals.map((goal: any) => ({
      ...goal,
      startDate: new Date(goal.startDate),
      targetDate: new Date(goal.targetDate),
    }));
  } catch (error) {
    console.error('Failed to load goals from storage:', error);
    return [];
  }
}

/**
 * 保存目标到 LocalStorage
 */
function saveGoalsToStorage(goals: UserGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals to storage:', error);
    throw new Error('STORAGE_FULL: 存储空间已满，请清理旧数据');
  }
}

/**
 * 验证目标数据
 */
function validateGoal(goal: Partial<UserGoal>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 验证必填字段
  if (!goal.type) {
    errors.push('目标类型不能为空');
  }

  if (!goal.startDate) {
    errors.push('开始日期不能为空');
  }

  if (!goal.targetDate) {
    errors.push('目标日期不能为空');
  }

  if (!goal.dailyCalorieGoal || goal.dailyCalorieGoal <= 0) {
    errors.push('每日卡路里目标必须大于0');
  }

  if (!goal.macroGoals) {
    errors.push('营养目标不能为空');
  } else {
    if (goal.macroGoals.protein < 0) errors.push('蛋白质目标不能为负数');
    if (goal.macroGoals.fat < 0) errors.push('脂肪目标不能为负数');
    if (goal.macroGoals.carbs < 0) errors.push('碳水化合物目标不能为负数');
    if (goal.macroGoals.fiber < 0) errors.push('膳食纤维目标不能为负数');
  }

  // 验证日期逻辑
  if (goal.startDate && goal.targetDate) {
    if (goal.targetDate <= goal.startDate) {
      errors.push('目标日期必须晚于开始日期');
    }
  }

  // 验证体重目标（如果是减重或增肌）
  if (goal.type === GoalType.WEIGHT_LOSS || goal.type === GoalType.MUSCLE_GAIN) {
    if (!goal.currentWeight || goal.currentWeight <= 0) {
      errors.push('当前体重必须大于0');
    }
    if (!goal.targetWeight || goal.targetWeight <= 0) {
      errors.push('目标体重必须大于0');
    }
    if (goal.currentWeight && goal.targetWeight) {
      if (goal.type === GoalType.WEIGHT_LOSS && goal.targetWeight >= goal.currentWeight) {
        errors.push('减重目标：目标体重必须小于当前体重');
      }
      if (goal.type === GoalType.MUSCLE_GAIN && goal.targetWeight <= goal.currentWeight) {
        errors.push('增肌目标：目标体重必须大于当前体重');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 创建新目标
 */
export function createGoal(
  goalData: Omit<UserGoal, 'id' | 'progress' | 'status'>
): UserGoal {
  const validation = validateGoal(goalData);
  if (!validation.valid) {
    throw new Error(`目标验证失败: ${validation.errors.join(', ')}`);
  }

  const goals = getGoalsFromStorage();

  // 检查是否已有活动目标
  const activeGoal = goals.find((g) => g.status === 'active');
  if (activeGoal) {
    throw new Error('已存在活动目标，请先完成或暂停当前目标');
  }

  const newGoal: UserGoal = {
    ...goalData,
    id: generateId(),
    progress: 0,
    status: 'active',
  };

  goals.push(newGoal);
  saveGoalsToStorage(goals);

  return newGoal;
}

/**
 * 获取所有目标
 */
export function getAllGoals(): UserGoal[] {
  return getGoalsFromStorage();
}

/**
 * 获取活动目标
 */
export function getActiveGoal(): UserGoal | null {
  const goals = getGoalsFromStorage();
  return goals.find((goal) => goal.status === 'active') || null;
}

/**
 * 根据 ID 获取目标
 */
export function getGoalById(id: string): UserGoal | null {
  const goals = getGoalsFromStorage();
  return goals.find((goal) => goal.id === id) || null;
}

/**
 * 更新目标
 */
export function updateGoal(
  id: string,
  updates: Partial<Omit<UserGoal, 'id' | 'userId'>>
): UserGoal | null {
  const goals = getGoalsFromStorage();
  const index = goals.findIndex((goal) => goal.id === id);

  if (index === -1) {
    console.error(`Goal with id ${id} not found`);
    return null;
  }

  const updatedGoal: UserGoal = {
    ...goals[index],
    ...updates,
  };

  // 验证更新后的目标
  const validation = validateGoal(updatedGoal);
  if (!validation.valid) {
    throw new Error(`目标验证失败: ${validation.errors.join(', ')}`);
  }

  goals[index] = updatedGoal;
  saveGoalsToStorage(goals);

  return updatedGoal;
}

/**
 * 删除目标
 */
export function deleteGoal(id: string): boolean {
  const goals = getGoalsFromStorage();
  const filteredGoals = goals.filter((goal) => goal.id !== id);

  if (filteredGoals.length === goals.length) {
    console.error(`Goal with id ${id} not found`);
    return false;
  }

  saveGoalsToStorage(filteredGoals);
  return true;
}

/**
 * 计算目标进度
 */
export function calculateProgress(goal: UserGoal): number {
  const now = new Date();
  const start = new Date(goal.startDate);
  const target = new Date(goal.targetDate);

  // 如果还没开始
  if (now < start) {
    return 0;
  }

  // 如果已经结束
  if (now >= target) {
    return 100;
  }

  // 计算时间进度
  const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
}

/**
 * 更新目标进度
 */
export function updateGoalProgress(goalId: string): UserGoal | null {
  const goal = getGoalById(goalId);
  if (!goal) return null;

  const progress = calculateProgress(goal);

  return updateGoal(goalId, { progress });
}

/**
 * 检查每日目标达成情况
 */
export function checkDailyGoalAchievement(
  goal: UserGoal,
  date: Date = new Date()
): {
  caloriesAchieved: boolean;
  proteinAchieved: boolean;
  fatAchieved: boolean;
  carbsAchieved: boolean;
  fiberAchieved: boolean;
  overallAchieved: boolean;
} {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const meals = getMealsByDateRange(startDate, endDate);

  // 计算当日总摄入
  const totalCalories = meals.reduce((sum, meal) => {
    return sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0);
  }, 0);

  const totalNutrition = meals.reduce(
    (total, meal) => ({
      protein: total.protein + meal.totalNutrition.protein,
      fat: total.fat + meal.totalNutrition.fat,
      carbs: total.carbs + meal.totalNutrition.carbs,
      fiber: total.fiber + meal.totalNutrition.fiber,
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );

  // 检查达成情况（允许80%-120%的范围）
  const caloriesAchieved =
    totalCalories >= goal.dailyCalorieGoal * 0.8 &&
    totalCalories <= goal.dailyCalorieGoal * 1.2;

  const proteinAchieved =
    totalNutrition.protein >= goal.macroGoals.protein * 0.8 &&
    totalNutrition.protein <= goal.macroGoals.protein * 1.2;

  const fatAchieved =
    totalNutrition.fat >= goal.macroGoals.fat * 0.8 &&
    totalNutrition.fat <= goal.macroGoals.fat * 1.2;

  const carbsAchieved =
    totalNutrition.carbs >= goal.macroGoals.carbs * 0.8 &&
    totalNutrition.carbs <= goal.macroGoals.carbs * 1.2;

  const fiberAchieved =
    totalNutrition.fiber >= goal.macroGoals.fiber * 0.8 &&
    totalNutrition.fiber <= goal.macroGoals.fiber * 1.2;

  const overallAchieved =
    caloriesAchieved &&
    proteinAchieved &&
    fatAchieved &&
    carbsAchieved &&
    fiberAchieved;

  return {
    caloriesAchieved,
    proteinAchieved,
    fatAchieved,
    carbsAchieved,
    fiberAchieved,
    overallAchieved,
  };
}

/**
 * 计算连续达标天数
 */
export function calculateConsecutiveDays(goal: UserGoal): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let consecutiveDays = 0;
  let currentDate = new Date(today);

  // 从今天往前检查
  while (currentDate >= new Date(goal.startDate)) {
    const achievement = checkDailyGoalAchievement(goal, currentDate);

    if (achievement.overallAchieved) {
      consecutiveDays++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return consecutiveDays;
}

/**
 * 获取目标统计信息
 */
export function getGoalStats(goal: UserGoal): {
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
  consecutiveDays: number;
  achievementRate: number;
} {
  const now = new Date();
  const start = new Date(goal.startDate);
  const target = new Date(goal.targetDate);

  const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.max(
    0,
    Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
  const daysRemaining = Math.max(
    0,
    Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const consecutiveDays = calculateConsecutiveDays(goal);

  // 计算达成率（检查已过去的天数中有多少天达标）
  let achievedDays = 0;
  const checkDate = new Date(start);
  const endCheckDate = new Date(Math.min(now.getTime(), target.getTime()));

  while (checkDate <= endCheckDate) {
    const achievement = checkDailyGoalAchievement(goal, checkDate);
    if (achievement.overallAchieved) {
      achievedDays++;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  const achievementRate = daysElapsed > 0 ? Math.round((achievedDays / daysElapsed) * 100) : 0;

  return {
    daysElapsed,
    daysRemaining,
    totalDays,
    consecutiveDays,
    achievementRate,
  };
}

/**
 * 暂停目标
 */
export function pauseGoal(goalId: string): UserGoal | null {
  return updateGoal(goalId, { status: 'paused' });
}

/**
 * 恢复目标
 */
export function resumeGoal(goalId: string): UserGoal | null {
  const goals = getGoalsFromStorage();
  const activeGoal = goals.find((g) => g.status === 'active' && g.id !== goalId);

  if (activeGoal) {
    throw new Error('已存在活动目标，请先暂停当前活动目标');
  }

  return updateGoal(goalId, { status: 'active' });
}

/**
 * 完成目标
 */
export function completeGoal(goalId: string): UserGoal | null {
  return updateGoal(goalId, { status: 'completed', progress: 100 });
}

/**
 * 清除所有目标
 */
export function clearAllGoals(): void {
  localStorage.removeItem(STORAGE_KEY);
}
