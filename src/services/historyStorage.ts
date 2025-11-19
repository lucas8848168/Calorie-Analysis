import { AnalysisResult, HistoryStorage } from '../types';

const STORAGE_KEY = 'food_analyzer_history';
const MAX_RECORDS = 50;
const MAX_AGE_DAYS = 30;

class HistoryStorageService implements HistoryStorage {
  /**
   * 保存分析记录
   */
  saveRecord(record: AnalysisResult): void {
    try {
      const records = this.getRecords();
      
      // 添加新记录到开头
      records.unshift(record);
      
      // 限制记录数量
      const limitedRecords = records.slice(0, MAX_RECORDS);
      
      // 清理过期记录
      const cleanedRecords = this.cleanOldRecords(limitedRecords);
      
      // 保存到LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedRecords));
    } catch (error) {
      if (this.isQuotaExceeded(error)) {
        throw new Error('STORAGE_FULL');
      }
      throw new Error('STORAGE_ERROR');
    }
  }

  /**
   * 获取所有记录
   */
  getRecords(): AnalysisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      
      const records = JSON.parse(data) as AnalysisResult[];
      return this.cleanOldRecords(records);
    } catch (error) {
      // 如果解析失败，返回空数组
      return [];
    }
  }

  /**
   * 删除指定记录
   */
  deleteRecord(timestamp: number): void {
    try {
      const records = this.getRecords();
      const filteredRecords = records.filter(
        (record) => record.timestamp !== timestamp
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    } catch (error) {
      throw new Error('STORAGE_ERROR');
    }
  }

  /**
   * 清空所有记录
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      throw new Error('STORAGE_ERROR');
    }
  }

  /**
   * 清理超过30天的记录
   */
  private cleanOldRecords(records: AnalysisResult[]): AnalysisResult[] {
    const now = Date.now();
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    
    return records.filter((record) => {
      return now - record.timestamp < maxAge;
    });
  }

  /**
   * 检查是否是存储配额超出错误
   */
  private isQuotaExceeded(error: any): boolean {
    return (
      error instanceof DOMException &&
      (error.code === 22 ||
        error.code === 1014 ||
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    );
  }

  /**
   * 检查LocalStorage是否可用
   */
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取存储使用情况（估算）
   */
  getStorageInfo(): { used: number; total: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const used = data ? data.length : 0;
      // LocalStorage通常限制为5-10MB，这里估算为5MB
      const total = 5 * 1024 * 1024;
      return { used, total };
    } catch (error) {
      return { used: 0, total: 0 };
    }
  }
}

// 导出单例
export const historyStorage = new HistoryStorageService();
