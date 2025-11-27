export interface Env {
  DOUBAO_API_KEY: string;
  DOUBAO_API_ENDPOINT?: string;
  ENVIRONMENT?: string;
}

/**
 * 验证API密钥是否已配置
 */
export function validateApiKey(env: Env): void {
  if (!env.DOUBAO_API_KEY) {
    throw new Error('API_KEY_MISSING: DOUBAO_API_KEY is not configured');
  }

  // 基本格式验证（假设密钥是字符串且有最小长度）
  if (typeof env.DOUBAO_API_KEY !== 'string' || env.DOUBAO_API_KEY.length < 10) {
    throw new Error('API_KEY_INVALID: DOUBAO_API_KEY format is invalid');
  }
}

/**
 * 获取API端点
 */
export function getApiEndpoint(env: Env): string {
  return env.DOUBAO_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';
}

/**
 * 获取配置
 */
export function getConfig(env: Env) {
  validateApiKey(env);
  
  return {
    apiKey: env.DOUBAO_API_KEY,
    apiEndpoint: getApiEndpoint(env),
    environment: env.ENVIRONMENT || 'development',
  };
}
