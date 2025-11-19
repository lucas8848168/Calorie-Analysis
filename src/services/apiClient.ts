import { AnalyzeRequest, AnalyzeResponse } from '../types';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8787';
const REQUEST_TIMEOUT = 60000; // 60秒（豆包 API 通常需要 30-60 秒）
const FALLBACK_TIMEOUT = 120000; // 降级策略超时120秒（复杂图片需要更长时间）

/**
 * 分析食物图片（带超时和降级策略）
 */
export async function analyzeFood(
  imageDataUrl: string,
  format: string
): Promise<AnalyzeResponse> {
  // 第一次尝试：正常超时
  try {
    return await analyzeFoodWithTimeout(imageDataUrl, format, REQUEST_TIMEOUT);
  } catch (error: any) {
    // 如果是超时错误，尝试降级策略
    if (error.message.includes('REQUEST_TIMEOUT')) {
      console.warn('First attempt timed out, trying with extended timeout...');
      try {
        return await analyzeFoodWithTimeout(imageDataUrl, format, FALLBACK_TIMEOUT);
      } catch (fallbackError: any) {
        // 降级也失败，返回友好提示
        throw new Error('REQUEST_TIMEOUT: 分析超时（已尝试120秒）。这张图片可能包含太多种类的食物。建议：1) 只拍摄单次用餐的食物 2) 避免拍摄整个餐桌或食材展示图 3) 如需分析多种食物，请分批上传');
      }
    }
    throw error;
  }
}

/**
 * 带超时的分析请求
 */
async function analyzeFoodWithTimeout(
  imageDataUrl: string,
  format: string,
  timeout: number
): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const request: AnalyzeRequest = {
      image: imageDataUrl,
      format,
    };

    const response = await fetch(`${API_ENDPOINT}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: AnalyzeResponse = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('REQUEST_TIMEOUT: 请求超时');
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR: 网络连接失败，请检查网络设置');
    }

    throw error;
  }
}

/**
 * 检查API健康状态
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_ENDPOINT}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
