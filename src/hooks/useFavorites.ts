import { useState, useEffect, useCallback } from 'react';
import { FavoriteFood, FoodItem } from '../types';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoritesSortedByFrequency,
  getRecentFoods,
  updateFrequency,
} from '../services/favoriteService';

interface UseFavoritesOptions {
  autoLoad?: boolean;
  limit?: number;
}

/**
 * 自定义Hook：管理收藏食物
 * 提供收藏食物的获取、添加、删除和频率管理功能
 */
export function useFavorites(options: UseFavoritesOptions = {}) {
  const { autoLoad = true, limit } = options;

  const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
  const [frequentFoods, setFrequentFoods] = useState<FavoriteFood[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载所有收藏
  const loadFavorites = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const allFavorites = getFavorites();
      setFavorites(allFavorites);

      // 同时加载常吃和最近食用
      const frequent = getFavoritesSortedByFrequency().slice(0, limit || 12);
      const recent = getRecentFoods(limit || 10);

      setFrequentFoods(frequent);
      setRecentFoods(recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载收藏失败');
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // 添加收藏
  const addToFavorites = useCallback(
    (food: FoodItem, userId: string = 'default') => {
      try {
        const newFavorite = addFavorite(food, userId);
        setFavorites((prev) => [...prev, newFavorite]);
        loadFavorites(); // 重新加载以更新频率排序
        return newFavorite;
      } catch (err) {
        setError(err instanceof Error ? err.message : '添加收藏失败');
        console.error('Failed to add favorite:', err);
        return null;
      }
    },
    [loadFavorites]
  );

  // 删除收藏
  const removeFromFavorites = useCallback(
    (foodId: string) => {
      try {
        const success = removeFavorite(foodId);
        if (success) {
          setFavorites((prev) => prev.filter((f) => f.id !== foodId));
          loadFavorites(); // 重新加载以更新列表
        }
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除收藏失败');
        console.error('Failed to remove favorite:', err);
        return false;
      }
    },
    [loadFavorites]
  );

  // 更新使用频率
  const incrementFrequency = useCallback(
    (foodName: string) => {
      try {
        updateFrequency(foodName);
        loadFavorites(); // 重新加载以更新排序
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新频率失败');
        console.error('Failed to update frequency:', err);
        return false;
      }
    },
    [loadFavorites]
  );

  // 检查是否已收藏
  const isFavorite = useCallback(
    (foodName: string) => {
      return favorites.some((f) => f.foodItem.name === foodName);
    },
    [favorites]
  );

  // 刷新数据
  const refresh = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  // 自动加载
  useEffect(() => {
    if (autoLoad) {
      loadFavorites();
    }
  }, [autoLoad, loadFavorites]);

  return {
    favorites,
    frequentFoods,
    recentFoods,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    incrementFrequency,
    isFavorite,
    refresh,
  };
}
