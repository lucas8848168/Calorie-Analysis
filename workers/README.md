# Cloudflare Workers API

食物卡路里分析器的后端 API 服务。

## 📋 功能

- 接收食物图片
- 调用 AI API 进行识别
- 返回营养分析结果
- 错误处理和重试机制

## 🔧 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.dev.vars` 文件：
```bash
DOUBAO_API_KEY=your_api_key_here
DOUBAO_API_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
USE_MOCK=false
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:8787`

## 🚀 部署

### 使用 Wrangler CLI
```bash
# 设置 Secrets
wrangler secret put DOUBAO_API_KEY
wrangler secret put DOUBAO_API_ENDPOINT

# 部署
npm run deploy
```

### 使用 GitHub Actions
推送代码到 main 分支会自动触发部署。

## 📁 文件结构

```
workers/
├── src/
│   ├── worker.ts              # 主入口文件
│   ├── doubaoClient.ts        # AI API 客户端（不在 GitHub）
│   ├── config.ts              # 配置管理（不在 GitHub）
│   ├── mockData.ts            # 测试数据（不在 GitHub）
│   ├── *.placeholder.ts       # 占位文件（说明用）
│   └── index.ts               # 导出
├── wrangler.toml              # Workers 配置
└── package.json
```

## 🔐 安全说明

核心业务逻辑文件（`doubaoClient.ts`、`config.ts`）不会上传到 GitHub。

如果你 fork 了这个项目，需要自己实现这些文件。

## 📝 API 文档

### POST /api/analyze
分析食物图片

**请求体**:
```json
{
  "image": "base64_encoded_image",
  "format": "jpeg"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "name": "米饭",
        "portion": "1碗约200克",
        "calories": 232,
        "nutrition": {
          "protein": 4.6,
          "fat": 0.6,
          "carbs": 51.2,
          "fiber": 0.6
        }
      }
    ],
    "totalCalories": 232,
    "confidence": "high",
    "notes": "健康建议..."
  }
}
```

### GET /health
健康检查

**响应**:
```json
{
  "status": "healthy",
  "timestamp": 1700000000000,
  "version": "1.0.0"
}
```

## 🐛 故障排除

### API 密钥错误
确保已正确设置 Secrets：
```bash
wrangler secret list
```

### CORS 错误
检查 `worker.ts` 中的 `ALLOWED_ORIGINS` 配置。

### 部署失败
1. 检查 `wrangler.toml` 配置
2. 验证 API Token 权限
3. 查看 Cloudflare Workers 日志

## 📞 支持

如有问题，请查看主项目的文档或提交 Issue。
