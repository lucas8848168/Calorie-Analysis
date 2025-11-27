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
    model: 'doubao-seed-1-6-251015', // 使用推理增强版本
    max_completion_tokens: 2000, // 新模型使用 max_completion_tokens
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`,
            },
          },
          {
            type: 'text',
            text: PROMPT_TEMPLATE,
          },
        ],
      },
    ],
    reasoning_effort: 'medium', // 推理强度：low/medium/high
    temperature: 0.5,
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

    // 检查特殊情况：模糊图片或非食物
    if (result.foods.length === 0) {
      if (result.confidence === 'unclear') {
        throw new Error('IMAGE_UNCLEAR: 图片模糊或不清晰，无法准确识别。请上传更清晰的食物图片。');
      } else if (result.confidence === 'not_food') {
        throw new Error('NOT_FOOD: 这张图片不是食物图片。请上传包含食物的图片进行分析。');
      } else {
        throw new Error('NO_FOOD_DETECTED: 未能识别到食物。请确保图片中包含清晰可见的食物。');
      }
    }

    return result as DoubaoResponse;
  } catch (error) {
    // 如果是我们自定义的错误，直接抛出
    if (error instanceof Error && 
        (error.message.startsWith('IMAGE_UNCLEAR:') || 
         error.message.startsWith('NOT_FOOD:') ||
         error.message.startsWith('NO_FOOD_DETECTED:'))) {
      throw error;
    }
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
