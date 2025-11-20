import { FavoriteFood, FoodItem } from '../types';
import { getMealsByDateRange } from './mealService';

const STORAGE_KEY = 'favorites';

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `fav_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 从 LocalStorage 获取所有收藏
 */
function getFavoritesFromStorage(): FavoriteFood[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const favorites = JSON.parse(data);
    return favorites.map((fav: any) => ({
      ...fav,
      lastUsed: new Date(fav.lastUsed),
      createdAt: new Date(fav.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load favorites from storage:', error);
    return [];
  }
}

/**
 * 保存收藏到 LocalStorage
 */
function saveFavoritesToStorage(favorites: FavoriteFood[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to storage:', error);
    throw new Error('STORAGE_FULL: 存储空间已满，请清理旧数据');
  }
}

/**
 * 添加食物到收藏
 */
export function addFavorite(
  food: FoodItem,
  userId: string = 'default',
  tags: string[] = []
): FavoriteFood {
  const favorites = getFavoritesFromStorage();

  // 检查是否已存在
  const existing = favorites.find((fav) => fav.foodItem.name === food.name);
  if (existing) {
    // 如果已存在，更新频率和最后使用时间
    existing.frequency++;
    existing.lastUsed = new Date();
    saveFavoritesToStorage(favorites);
    return existing;
  }

  // 创建新收藏
  const newFavorite: FavoriteFood = {
    id: generateId(),
    userId,
    foodItem: food,
    frequency: 1,
    lastUsed: new Date(),
    tags,
    createdAt: new Date(),
  };

  favorites.push(newFavorite);
  saveFavoritesToStorage(favorites);

  return newFavorite;
}

/**
 * 删除收藏
 */
export function removeFavorite(id: string): boolean {
  const favorites = getFavoritesFromStorage();
  const filteredFavorites = favorites.filter((fav) => fav.id !== id);

  if (filteredFavorites.length === favorites.length) {
    console.error(`Favorite with id ${id} not found`);
    return false;
  }

  saveFavoritesToStorage(filteredFavorites);
  return true;
}

/**
 * 获取所有收藏
 */
export function getFavorites(): FavoriteFood[] {
  return getFavoritesFromStorage();
}

/**
 * 按使用频率排序获取收藏
 */
export function getFavoritesSortedByFrequency(): FavoriteFood[] {
  const favorites = getFavoritesFromStorage();
  return favorites.sort((a, b) => b.frequency - a.frequency);
}

/**
 * 按标签过滤收藏
 */
export function getFavoritesByTag(tag: string): FavoriteFood[] {
  const favorites = getFavoritesFromStorage();
  return favorites.filter((fav) => fav.tags.includes(tag));
}

/**
 * 更新收藏的使用频率
 */
export function updateFrequency(foodName: string): void {
  const favorites = getFavoritesFromStorage();
  const favorite = favorites.find((fav) => fav.foodItem.name === foodName);

  if (favorite) {
    favorite.frequency++;
    favorite.lastUsed = new Date();
    saveFavoritesToStorage(favorites);
  }
}

/**
 * 获取最近食用的食物（从餐次记录中提取）
 */
export function getRecentFoods(days: number = 7): FoodItem[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const meals = getMealsByDateRange(startDate, endDate);

  // 提取所有食物并去重
  const foodMap = new Map<string, FoodItem>();

  meals.forEach((meal) => {
    meal.foods.forEach((food) => {
      if (!foodMap.has(food.name)) {
        foodMap.set(food.name, food);
      }
    });
  });

  // 转换为数组并按时间排序（最近的在前）
  return Array.from(foodMap.values()).reverse();
}

/**
 * 检查食物是否已收藏
 */
export function isFavorite(foodName: string): boolean {
  const favorites = getFavoritesFromStorage();
  return favorites.some((fav) => fav.foodItem.name === foodName);
}

/**
 * 清除所有收藏
 */
export function clearAllFavorites(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取收藏统计信息
 */
export function getFavoriteStats(): {
  totalCount: number;
  mostUsed: FavoriteFood | null;
  recentlyAdded: FavoriteFood[];
} {
  const favorites = getFavoritesFromStorage();

  const mostUsed =
    favorites.length > 0
      ? favorites.reduce((prev, current) =>
          prev.frequency > current.frequency ? prev : current
        )
      : null;

  const recentlyAdded = favorites
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    totalCount: favorites.length,
    mostUsed,
    recentlyAdded,
  };
}
