// Cloudflare Pages Function for food analysis
// This replaces the standalone Worker

interface Env {
  DOUBAO_API_KEY: string;
  DOUBAO_API_ENDPOINT?: string;
  USE_MOCK?: string;
}

const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

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

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // 验证请求大小
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'REQUEST_TOO_LARGE',
            message: '请求体积过大',
            timestamp: Date.now(),
          },
        },
        413
      );
    }

    // 解析请求体
    const body = await request.json();
    const { image } = body;

    // 验证请求数据
    if (!image || typeof image !== 'string') {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '缺少图片数据',
            timestamp: Date.now(),
          },
        },
        400
      );
    }

    // 验证 API 密钥
    if (!env.DOUBAO_API_KEY) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'API_KEY_MISSING',
            message: 'API密钥未配置',
            timestamp: Date.now(),
          },
        },
        500
      );
    }

    // 调用 AI API
    const apiEndpoint = env.DOUBAO_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';
    const result = await analyzeImage(image, env.DOUBAO_API_KEY, apiEndpoint);

    // 计算总卡路里
    const totalCalories = result.foods.reduce((sum, food) => sum + food.calories, 0);

    // 返回成功响应
    return jsonResponse({
      success: true,
      data: {
        foods: result.foods,
        totalCalories,
        confidence: result.confidence,
        notes: result.notes,
      },
    });
  } catch (error: any) {
    console.error('Analyze error:', error);

    const errorMessage = error.message || '';

    if (errorMessage.includes('IMAGE_UNCLEAR:')) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'IMAGE_UNCLEAR',
            message: errorMessage.replace('IMAGE_UNCLEAR:', '').trim(),
            timestamp: Date.now(),
          },
        },
        400
      );
    }

    if (errorMessage.includes('NOT_FOOD:')) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'NOT_FOOD',
            message: errorMessage.replace('NOT_FOOD:', '').trim(),
            timestamp: Date.now(),
          },
        },
        400
      );
    }

    if (errorMessage.includes('NO_FOOD_DETECTED:')) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'NO_FOOD_DETECTED',
            message: errorMessage.replace('NO_FOOD_DETECTED:', '').trim(),
            timestamp: Date.now(),
          },
        },
        400
      );
    }

    if (errorMessage.includes('429') || errorMessage.includes('SetLimitExceeded')) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'API 调用次数已达上限，请稍后重试',
            timestamp: Date.now(),
          },
        },
        429
      );
    }

    return jsonResponse(
      {
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: '分析失败，请稍后重试',
          timestamp: Date.now(),
        },
      },
      500
    );
  }
}

async function analyzeImage(imageBase64: string, apiKey: string, apiEndpoint: string) {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const requestBody = {
    model: 'doubao-seed-1-6-251015',
    max_completion_tokens: 2000,
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
    reasoning_effort: 'medium',
    temperature: 0.5,
  };

  const response = await fetch(`${apiEndpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI_API_ERROR: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in response');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  const result = JSON.parse(jsonMatch[0]);

  if (!result.foods || !Array.isArray(result.foods)) {
    throw new Error('Invalid response format');
  }

  if (result.foods.length === 0) {
    if (result.confidence === 'unclear') {
      throw new Error('IMAGE_UNCLEAR: 图片模糊或不清晰，无法准确识别。请上传更清晰的食物图片。');
    } else if (result.confidence === 'not_food') {
      throw new Error('NOT_FOOD: 这张图片不是食物图片。请上传包含食物的图片进行分析。');
    } else {
      throw new Error('NO_FOOD_DETECTED: 未能识别到食物。请确保图片中包含清晰可见的食物。');
    }
  }

  return result;
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
