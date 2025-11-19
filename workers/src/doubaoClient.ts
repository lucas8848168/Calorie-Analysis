import { Env } from './config';

const PROMPT_TEMPLATE = `你是一个专业的营养分析师。请仔细分析这张图片并按以下步骤操作：

第一步：判断图片质量和内容
1. 检查图片是否清晰可辨认
   - 如果图片模糊、过暗、过曝或无法辨认，返回 confidence: "unclear"
2. 判断图片中是否包含食物
   - 如果是风景、人物、动物、物品等非食物内容，返回 confidence: "not_food"
   - 如果是食物，继续分析

第二步：如果是清晰的食物图片，进行详细分析（所有字段都必须填写）
1. 识别食物名称（中文）
2. **必须估算食物的数量和分量**（如：2个鸡蛋约100克、一碗米饭约200克、一份鸡肉约150克）
3. 识别主要材料和成分
4. 根据估算的分量计算营养成分（营养成分必须基于实际分量，不是100克标准值）

第三步：返回JSON格式结果

返回格式（必须严格遵守，所有字段都是必填的）：
{
  "foods": [
    {
      "name": "食物名称（必填）",
      "portion": "数量和分量（必填！如：2个鸡蛋约100克、1碗米饭约200克、1份鸡肉约150克）",
      "ingredients": "主要材料成分（必填，如：鸡蛋、米饭、鸡肉、蔬菜）",
      "calories": 卡路里数值（必填，kcal，整数，基于实际分量计算）,
      "nutrition": {
        "protein": 蛋白质（必填，克，保留1位小数，基于实际分量）,
        "fat": 脂肪（必填，克，保留1位小数，基于实际分量）,
        "carbs": 碳水化合物（必填，克，保留1位小数，基于实际分量）,
        "fiber": 膳食纤维（必填，克，保留1位小数，基于实际分量）
      }
    }
  ],
  "confidence": "high/medium/low",
  "notes": "补充说明（如：营养成分基于估算分量计算）"
}

重要提示：
- portion字段必须包含数量（如：1个、2个、一碗、一份）和重量（如：约50克、约200克）
- 如果看到2个鸡蛋，portion应该是"2个鸡蛋约100克"，不是"1个鸡蛋约50克"
- 营养成分必须基于图片中看到的实际分量，不是标准100克的数据

特殊情况返回格式：

1. 图片不清晰时：
{
  "foods": [],
  "confidence": "unclear",
  "notes": "图片不够清晰，无法准确识别食物，请重新上传清晰的图片"
}

2. 图片不是食物时：
{
  "foods": [],
  "confidence": "not_food",
  "notes": "这张图片不是食物图片，请上传包含食物的图片"
}

关键注意事项：
1. **portion字段绝对不能省略**，必须包含数量和重量
2. 仔细观察图片中食物的数量（1个、2个、3个等）
3. 分量估算要合理，参考常见餐具大小（碗、盘、杯等）
4. 营养成分必须基于图片中实际看到的分量计算，不是标准100克
5. 如果有多种食物，分别列出每种食物的信息
6. 数值要准确，不要使用范围值
7. 置信度要准确反映识别的确定程度

示例：
- 看到2个鸡蛋 → portion: "2个鸡蛋约100克"
- 看到一碗米饭 → portion: "1碗米饭约200克"
- 看到一盘炒菜 → portion: "1份约150克"`;

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
    temperature: 0.7,
    max_tokens: 1000,
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
