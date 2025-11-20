/**
 * 存储优化工具
 * 提供数据分片、日期索引、自动清理和容量监控功能
 */

interface StorageInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

/**
 * 获取LocalStorage使用情况
 */
export function getStorageInfo(): StorageInfo {
  let used = 0;
  let total = 5 * 1024 * 1024; // 假设5MB总容量（浏览器通常是5-10MB）

  try {
    // 计算已使用空间
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error);
  }

  const available = total - used;
  const percentage = (used / total) * 100;

  return {
    used,
    available,
    total,
    percentage,
  };
}

/**
 * 检查存储空间是否充足
 */
export function hasEnoughSpace(requiredBytes: number): boolean {
  const info = getStorageInfo();
  return info.available >= requiredBytes;
}

/**
 * 清理过期数据
 * @param daysToKeep 保留最近多少天的数据
 */
export function cleanupOldData(daysToKeep: number = 90): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffTime = cutoffDate.getTime();

  let cleanedCount = 0;

  try {
    // 清理历史记录
    const historyKey = 'analysis_history';
    const historyData = localStorage.getItem(historyKey);
    if (historyData) {
      const records = JSON.parse(historyData);
      const filtered = records.filter((record: any) => record.timestamp > cutoffTime);
      if (filtered.length < records.length) {
        localStorage.setItem(historyKey, JSON.stringify(filtered));
        cleanedCount += records.length - filtered.length;
      }
    }

    // 清理餐次记录
    const mealsKey = 'meals';
    const mealsData = localStorage.getItem(mealsKey);
    if (mealsData) {
      const meals = JSON.parse(mealsData);
      const filtered = meals.filter((meal: any) => {
        const mealTime = new Date(meal.mealTime).getTime();
        return mealTime > cutoffTime;
      });
      if (filtered.length < meals.length) {
        localStorage.setItem(mealsKey, JSON.stringify(filtered));
        cleanedCount += meals.length - filtered.length;
      }
    }

    // 清理收藏（只清理超过1年未使用的）
    const favoritesKey = 'favorites';
    const favoritesData = localStorage.getItem(favoritesKey);
    if (favoritesData) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoTime = oneYearAgo.getTime();

      const favorites = JSON.parse(favoritesData);
      const filtered = favorites.filter((fav: any) => {
        const lastUsed = new Date(fav.lastUsed).getTime();
        return lastUsed > oneYearAgoTime;
      });
      if (filtered.length < favorites.length) {
        localStorage.setItem(favoritesKey, JSON.stringify(filtered));
        cleanedCount += favorites.length - filtered.length;
      }
    }
  } catch (error) {
    console.error('Failed to cleanup old data:', error);
  }

  return cleanedCount;
}

/**
 * 按日期索引数据
 * 将数据按年-月分片存储，提高查询效率
 */
export function createDateIndex<T extends { timestamp?: number; mealTime?: Date; createdAt?: Date }>(
  data: T[]
): Map<string, T[]> {
  const index = new Map<string, T[]>();

  data.forEach((item) => {
    // 获取日期
    let date: Date;
    if (item.timestamp) {
      date = new Date(item.timestamp);
    } else if (item.mealTime) {
      date = new Date(item.mealTime);
    } else if (item.createdAt) {
      date = new Date(item.createdAt);
    } else {
      return; // 跳过没有日期的项
    }

    // 创建年-月键
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!index.has(key)) {
      index.set(key, []);
    }
    index.get(key)!.push(item);
  });

  return index;
}

/**
 * 按日期范围查询数据
 */
export function queryByDateRange<T extends { timestamp?: number; mealTime?: Date; createdAt?: Date }>(
  index: Map<string, T[]>,
  startDate: Date,
  endDate: Date
): T[] {
  const results: T[] = [];
  const startKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  const endKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;

  // 遍历索引，找到日期范围内的所有数据
  for (const [key, items] of index.entries()) {
    if (key >= startKey && key <= endKey) {
      results.push(...items);
    }
  }

  // 进一步过滤精确的日期范围
  return results.filter((item) => {
    let date: Date;
    if (item.timestamp) {
      date = new Date(item.timestamp);
    } else if (item.mealTime) {
      date = new Date(item.mealTime);
    } else if (item.createdAt) {
      date = new Date(item.createdAt);
    } else {
      return false;
    }

    return date >= startDate && date <= endDate;
  });
}

/**
 * 压缩数据（移除不必要的字段）
 */
export function compressData<T extends Record<string, any>>(
  data: T[],
  fieldsToKeep: (keyof T)[]
): Partial<T>[] {
  return data.map((item) => {
    const compressed: Partial<T> = {};
    fieldsToKeep.forEach((field) => {
      if (item[field] !== undefined) {
        compressed[field] = item[field];
      }
    });
    return compressed;
  });
}

/**
 * 自动清理策略
 * 当存储空间不足时自动清理旧数据
 */
export function autoCleanup(): boolean {
  const info = getStorageInfo();

  // 如果使用超过80%，开始清理
  if (info.percentage > 80) {
    console.log('Storage usage over 80%, starting cleanup...');

    // 先清理90天前的数据
    let cleaned = cleanupOldData(90);

    // 如果还不够，清理60天前的数据
    const newInfo = getStorageInfo();
    if (newInfo.percentage > 80) {
      cleaned += cleanupOldData(60);
    }

    // 如果还不够，清理30天前的数据
    const finalInfo = getStorageInfo();
    if (finalInfo.percentage > 80) {
      cleaned += cleanupOldData(30);
    }

    console.log(`Cleaned ${cleaned} items`);
    return true;
  }

  return false;
}

/**
 * 监控存储容量
 * 返回是否需要用户注意
 */
export function monitorStorage(): {
  needsAttention: boolean;
  message: string;
  info: StorageInfo;
} {
  const info = getStorageInfo();

  if (info.percentage > 90) {
    return {
      needsAttention: true,
      message: '存储空间即将用完，建议清理旧数据',
      info,
    };
  }

  if (info.percentage > 80) {
    return {
      needsAttention: true,
      message: '存储空间使用较多，系统已自动清理部分旧数据',
      info,
    };
  }

  return {
    needsAttention: false,
    message: '存储空间充足',
    info,
  };
}

/**
 * 格式化存储大小
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
