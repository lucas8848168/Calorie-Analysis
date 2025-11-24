/**
 * 豆包 AI API 客户端（占位文件）
 * 
 * 这是一个占位文件，用于说明核心业务逻辑的位置。
 * 实际的 doubaoClient.ts 文件不会上传到 GitHub。
 * 
 * 如果你需要部署自己的版本，请：
 * 1. 创建 workers/src/doubaoClient.ts 文件
 * 2. 实现 analyzeImage 函数
 * 3. 配置你的 AI API 密钥
 */

export interface DoubaoResponse {
  foods: Array<{
    name: string;
    portion?: string;
    ingredients?: string;
    calories: number;
    nutrition: {
      protein: number;
      fat: number;
      carbs: number;
      fiber: number;
    };
  }>;
  confidence?: string;
  notes?: string;
}

/**
 * 分析图片中的食物
 * @param imageBase64 - Base64 编码的图片
 * @param apiKey - AI API 密钥
 * @param apiEndpoint - AI API 端点
 * @param retries - 重试次数
 */
export async function analyzeImage(
  imageBase64: string,
  apiKey: string,
  apiEndpoint: string,
  retries?: number
): Promise<DoubaoResponse> {
  throw new Error('请实现 doubaoClient.ts 文件');
}
