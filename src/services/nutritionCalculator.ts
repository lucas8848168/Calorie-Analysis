import { User, GoalType } from '../types';

/**
 * 营养计算器
 * 根据用户信息计算推荐的每日卡路里和营养目标
 */

/**
 * 活动系数
 */
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // 久坐：办公室工作，很少运动
  light: 1.375, // 轻度活动：轻体力工作，每周运动1-3天
  moderate: 1.55, // 中度活动：中体力工作，每周运动3-5天
  heavy: 1.725, // 重度活动：重体力工作，每周运动6-7天
};

/**
 * 计算基础代谢率 (BMR) - 使用 Mifflin-St Jeor 公式
 * 男性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
 * 女性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
 */
function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * 计算每日总能量消耗 (TDEE)
 * TDEE = BMR × 活动系数
 */
function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy'
): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * 根据目标类型调整卡路里
 */
function adjustCaloriesForGoal(tdee: number, goalType: GoalType): number {
  switch (goalType) {
    case GoalType.WEIGHT_LOSS:
      return Math.round(tdee * 0.8); // 减重：减少20%
    case GoalType.MUSCLE_GAIN:
      return Math.round(tdee * 1.15); // 增肌：增加15%
    case GoalType.MAINTAIN:
      return Math.round(tdee); // 维持：保持TDEE
    case GoalType.HEALTH:
      return Math.round(tdee); // 健康：保持TDEE
    default:
      return Math.round(tdee);
  }
}

/**
 * 计算推荐的宏量营养素分配
 * 返回每日推荐的蛋白质、脂肪、碳水化合物、膳食纤维克数
 */
function calculateMacros(
  dailyCalories: number,
  goalType: GoalType
): {
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
} {
  let proteinRatio: number;
  let fatRatio: number;
  let carbsRatio: number;

  switch (goalType) {
    case GoalType.WEIGHT_LOSS:
      // 减重：高蛋白，中脂肪，低碳水
      proteinRatio = 0.35; // 35%
      fatRatio = 0.30; // 30%
      carbsRatio = 0.35; // 35%
      break;
    case GoalType.MUSCLE_GAIN:
      // 增肌：高蛋白，中碳水，低脂肪
      proteinRatio = 0.30; // 30%
      fatRatio = 0.25; // 25%
      carbsRatio = 0.45; // 45%
      break;
    case GoalType.MAINTAIN:
    case GoalType.HEALTH:
    default:
      // 维持/健康：均衡
      proteinRatio = 0.25; // 25%
      fatRatio = 0.30; // 30%
      carbsRatio = 0.45; // 45%
      break;
  }

  // 计算克数
  // 蛋白质和碳水：4 kcal/g，脂肪：9 kcal/g
  const protein = Math.round((dailyCalories * proteinRatio) / 4);
  const fat = Math.round((dailyCalories * fatRatio) / 9);
  const carbs = Math.round((dailyCalories * carbsRatio) / 4);

  // 膳食纤维：建议每1000 kcal摄入14g
  const fiber = Math.round((dailyCalories / 1000) * 14);

  return { protein, fat, carbs, fiber };
}

/**
 * 根据用户信息计算推荐的营养目标
 */
export function calculateRecommendedGoals(
  user: User,
  goalType: GoalType = GoalType.HEALTH
): {
  dailyCalories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  bmr: number;
  tdee: number;
} | null {
  // 检查必需的用户信息
  if (
    !user.profile?.currentWeight ||
    !user.profile?.height ||
    !user.profile?.age ||
    !user.profile?.gender
  ) {
    return null;
  }

  const { currentWeight, height, age, gender, activityLevel } = user.profile;

  // 如果没有设置活动水平，默认为久坐
  const activity = activityLevel || 'sedentary';

  // 计算 BMR
  const bmr = calculateBMR(currentWeight, height, age, gender);

  // 计算 TDEE
  const tdee = calculateTDEE(bmr, activity);

  // 根据目标调整卡路里
  const dailyCalories = adjustCaloriesForGoal(tdee, goalType);

  // 计算宏量营养素
  const macros = calculateMacros(dailyCalories, goalType);

  return {
    dailyCalories,
    macros,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  };
}

/**
 * 获取活动水平的描述
 */
export function getActivityLevelDescription(
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy'
): string {
  const descriptions = {
    sedentary: '久坐（办公室工作，很少运动）',
    light: '轻度活动（轻体力工作，每周运动1-3天）',
    moderate: '中度活动（中体力工作，每周运动3-5天）',
    heavy: '重度活动（重体力工作，每周运动6-7天）',
  };
  return descriptions[activityLevel];
}

/**
 * 获取目标类型的推荐说明
 */
export function getGoalTypeRecommendation(goalType: GoalType): string {
  const recommendations = {
    [GoalType.WEIGHT_LOSS]:
      '减重目标：卡路里摄入减少20%，高蛋白饮食有助于保持肌肉量',
    [GoalType.MUSCLE_GAIN]:
      '增肌目标：卡路里摄入增加15%，确保充足的蛋白质和碳水化合物',
    [GoalType.MAINTAIN]: '维持目标：保持当前体重，均衡饮食',
    [GoalType.HEALTH]: '健康目标：均衡营养，保持健康生活方式',
  };
  return recommendations[goalType];
}
