import { AnalyzeRequest, AnalyzeResponse } from '../types';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8787';
const REQUEST_TIMEOUT = 90000; // 90秒

/**
 * 分析食物图片
 */
export async function analyzeFood(
  imageDataUrl: string,
  format: string
): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

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
      throw new Error('REQUEST_TIMEOUT: 请求超时，请稍后重试');
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
