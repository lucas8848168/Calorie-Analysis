import { Env } from './config';

const PROMPT_TEMPLATE = `分析图片中的食物，返回JSON。

规则：
- 图片模糊 → {"foods":[],"confidence":"unclear"}
- 非食物 → {"foods":[],"confidence":"not_food"}
- 食物>8种 → 只识别主要5-8种

格式：
{"foods":[{"name":"食物名","portion":"数量+重量(如1碗约200克)","ingredients":"成分","calories":数字,"nutrition":{"protein":数字,"fat":数字,"carbs":数字,"fiber":数字}}],"confidence":"high/medium/low","notes":"健康建议"}

要求：
- portion必填，含数量和重量
- 营养基于实际分量，非100克标准
- 数值保留1位小数
- notes必须包含：
  1. 这餐食物的健康优点和缺点
  2. 适合人群（老年人/高血压/糖尿病/青春期青少年/儿童/孕妇/减肥人群等）
  3. 不适合人群和禁忌
  4. 具体的饮食建议
- notes字数控制在150-200字，简洁实用`;

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
 * 调用方舟豆包API分析图片
 */
export async function analyzeImage(
  imageBase64: string,
  apiKey: string,
  apiEndpoint: string,
  retries: number = 3
): Promise<DoubaoResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await callDoubaoAPI(imageBase64, apiKey, apiEndpoint);
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // 如果是速率限制错误，使用指数退避
      if (isRateLimitError(error)) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await sleep(delay);
        continue;
      }
      
      // 其他错误直接抛出
      throw error;
    }
  }

  throw lastError || new Error('AI_API_ERROR: Failed after retries');
}

/**
 * 实际调用API
 */
async function callDoubaoAPI(
  imageBase64: string,
  apiKey: string,
  apiEndpoint: string
): Promise<DoubaoResponse> {
  // 移除Base64前缀（如果有）
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const requestBody = {
    model: 'doubao-seed-1-6-vision-250815',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: PROMPT_TEMPLATE,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`,
            },
          },
        ],
      },
    ],
    temperature: 0.5,
    max_tokens: 1200, // 增加token限制以支持更详细的健康建议
  };

  const response = await fetch(`${apiEndpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI_API_ERROR: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // 解析响应
  return parseDoubaoResponse(data);
}

/**
 * 解析方舟豆包API响应
 */
function parseDoubaoResponse(data: any): DoubaoResponse {
  try {
    // 提取AI返回的文本内容
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    // 尝试从文本中提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // 验证响应格式
    if (!result.foods || !Array.isArray(result.foods)) {
      throw new Error('Invalid response format');
    }

    return result as DoubaoResponse;
  } catch (error) {
    throw new Error(`Failed to parse API response: ${error}`);
  }
}

/**
 * 检查是否是速率限制错误
 */
function isRateLimitError(error: any): boolean {
  return (
    error?.message?.includes('429') ||
    error?.message?.includes('rate limit') ||
    error?.message?.includes('RATE_LIMIT')
  );
}

/**
 * 延迟函数
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
