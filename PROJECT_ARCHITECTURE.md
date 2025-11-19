# 项目架构文档

**项目名称**: Food Calorie Analyzer (食物卡路里分析器)  
**版本**: v2.0.2  
**更新时间**: 2025-11-20

---

## 📐 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React SPA (前端应用)                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ 图片上传     │  │ 结果展示     │  │ 历史记录     │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │           │                │                │          │  │
│  │           └────────────────┴────────────────┘          │  │
│  │                      │                                  │  │
│  │              ┌───────▼────────┐                        │  │
│  │              │  API Client     │                        │  │
│  │              └───────┬────────┘                        │  │
│  └──────────────────────┼─────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTPS
                          │
┌─────────────────────────▼─────────────────────────────────────┐
│              Cloudflare Workers (后端 API)                     │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    Worker Handler                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ 请求验证     │  │ 图片处理     │  │ 响应格式化   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │           │                │                │          │   │
│  │           └────────────────┴────────────────┘          │   │
│  │                      │                                  │   │
│  │              ┌───────▼────────┐                        │   │
│  │              │ Doubao Client   │                        │   │
│  │              └───────┬────────┘                        │   │
│  └──────────────────────┼─────────────────────────────────┘   │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTPS
                          │
┌─────────────────────────▼─────────────────────────────────────┐
│                  豆包 1.6 Vision API                           │
│                  (AI 图像识别服务)                             │
└───────────────────────────────────────────────────────────────┘
```

---

## 🏗️ 前端架构

### 技术栈
- **框架**: React 19
- **语言**: TypeScript (严格模式)
- **构建工具**: Vite 7
- **样式**: CSS3 + 自定义设计系统
- **状态管理**: React Hooks (useState, useRef, useEffect)
- **存储**: LocalStorage
- **测试**: Vitest

### 目录结构

```
src/
├── components/              # React 组件
│   ├── ImageUploader/       # 图片上传组件
│   │   ├── ImageUploader.tsx
│   │   └── ImageUploader.css
│   ├── AnalysisDisplay/     # 分析结果展示
│   │   ├── AnalysisDisplay.tsx
│   │   └── AnalysisDisplay.css
│   ├── HistoryList/         # 历史记录列表
│   │   ├── HistoryList.tsx
│   │   └── HistoryList.css
│   ├── LoadingIndicator/    # 加载指示器
│   │   ├── LoadingIndicator.tsx
│   │   └── LoadingIndicator.css
│   ├── EmptyState/          # 空状态组件
│   │   ├── EmptyState.tsx
│   │   └── EmptyState.css
│   └── ErrorBoundary/       # 错误边界
│       └── ErrorBoundary.tsx
├── services/                # 业务逻辑层
│   ├── apiClient.ts         # API 通信
│   ├── foodDetector.ts      # 食物检测逻辑
│   └── historyStorage.ts    # 历史记录存储
├── utils/                   # 工具函数
│   ├── dataParser.ts        # 数据解析
│   └── imageProcessor.ts    # 图片处理
├── types/                   # TypeScript 类型定义
│   └── index.ts             # 所有类型定义
├── styles/                  # 全局样式
│   └── design-system.css    # 设计系统
├── App.tsx                  # 主应用组件
├── App.css                  # 应用样式
├── main.tsx                 # 入口文件
└── index.css                # 全局样式
```

### 组件层次

```
App
├── Header (标题和说明)
├── Navigation (分析/历史记录切换)
└── Main
    ├── ImageUploader (上传页面)
    │   ├── 拖拽区域
    │   ├── 文件选择
    │   └── 图片预览
    ├── LoadingIndicator (分析中)
    │   ├── 加载动画
    │   └── 提示信息
    ├── AnalysisDisplay (结果页面)
    │   ├── 总卡路里卡片
    │   ├── 营养成分速览
    │   │   ├── 食物列表
    │   │   └── 营养成分网格
    │   ├── 健康建议
    │   └── 操作按钮
    └── HistoryList (历史记录)
        └── 历史记录项列表
```

### 数据流

```
用户操作
    │
    ▼
组件事件处理
    │
    ▼
Service 层处理
    │
    ├─► API Client ──► Workers API ──► 豆包 API
    │                      │
    │                      ▼
    │                  响应数据
    │                      │
    └─► Data Parser ◄──────┘
            │
            ▼
        更新状态
            │
            ▼
        组件重渲染
```

---

## ⚙️ 后端架构

### 技术栈
- **平台**: Cloudflare Workers
- **运行时**: Workers Runtime (非 Node.js)
- **语言**: TypeScript
- **部署**: Wrangler CLI

### 目录结构

```
workers/
├── src/
│   ├── worker.ts           # 主入口
│   ├── doubaoClient.ts     # 豆包 API 客户端
│   └── config.ts           # 配置管理
├── wrangler.toml           # Workers 配置
├── package.json            # 依赖配置
└── tsconfig.json           # TypeScript 配置
```

### API 端点

#### POST /api/analyze
分析食物图片

**请求**:
```json
{
  "image": "data:image/jpeg;base64,...",
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
        "name": "番茄炒蛋",
        "portion": "1碗约200克",
        "ingredients": "鸡蛋、番茄、油、盐",
        "calories": 255,
        "nutrition": {
          "protein": 10.5,
          "fat": 16.5,
          "carbs": 10.5,
          "fiber": 2.4
        }
      }
    ],
    "totalCalories": 255,
    "confidence": "high",
    "notes": "健康建议内容..."
  }
}
```

#### GET /health
健康检查

**响应**:
```json
{
  "status": "healthy",
  "timestamp": 1700000000000,
  "version": "1.0.0"
}
```

### 豆包 API 集成

#### Prompt 设计

```
分析图片中的食物，返回JSON。

规则：
- 图片模糊 → {"foods":[],"confidence":"unclear"}
- 非食物 → {"foods":[],"confidence":"not_food"}
- 食物>8种 → 只识别主要5-8种

格式：
{
  "foods": [...],
  "confidence": "high/medium/low",
  "notes": "健康建议"
}

要求：
- portion必填，含数量和重量
- 营养基于实际分量，非100克标准
- 数值保留1位小数
- notes必须包含：
  1. 这餐食物的健康优缺点
  2. 适合人群
  3. 不适合人群和禁忌
  4. 具体的饮食建议
```

#### 重试机制

```typescript
// 指数退避重试
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    return await callDoubaoAPI(...);
  } catch (error) {
    if (isRateLimitError(error)) {
      await sleep(Math.pow(2, attempt) * 1000);
      continue;
    }
    throw error;
  }
}
```

---

## 💾 数据模型

### 核心类型定义

```typescript
// 营养成分
interface NutritionInfo {
  protein: number;  // 蛋白质（克）
  fat: number;      // 脂肪（克）
  carbs: number;    // 碳水化合物（克）
  fiber: number;    // 膳食纤维（克）
}

// 食物项
interface FoodItem {
  name: string;           // 食物名称
  portion?: string;       // 份量说明
  ingredients?: string;   // 材料成分
  calories: number;       // 卡路里
  nutrition: NutritionInfo;
}

// 分析结果
interface AnalysisResult {
  id: string;             // UUID
  timestamp: number;      // Unix时间戳
  imageUrl: string;       // Base64或ObjectURL
  foods: FoodItem[];      // 食物列表
  totalCalories: number;  // 总卡路里
  confidence?: string;    // 置信度
  notes?: string;         // 健康建议
}
```

### 存储策略

#### LocalStorage 结构
```json
{
  "food-analyzer-history": [
    {
      "id": "1700000000000-abc123",
      "timestamp": 1700000000000,
      "imageUrl": "data:image/jpeg;base64,...",
      "foods": [...],
      "totalCalories": 255,
      "notes": "..."
    }
  ]
}
```

#### 存储限制
- 最大记录数: 50 条
- 超出时: 删除最旧记录
- 图片大小: 压缩至 1MB 以下

---

## 🎨 设计系统

### 色彩系统

```css
/* 主色调 */
--color-primary: #4CAF50;        /* 健康绿 */
--color-secondary: #FF9800;      /* 活力橙 */

/* 功能色 */
--color-success: #4CAF50;
--color-warning: #FFC107;
--color-error: #F44336;
--color-info: #2196F3;

/* 渐变色 */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
```

### 间距系统

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### 字体系统

```css
--font-xs: 12px;
--font-sm: 14px;
--font-base: 16px;
--font-lg: 18px;
--font-xl: 20px;
--font-2xl: 24px;
```

---

## 🔒 安全性

### 前端安全
- ✅ 输入验证（文件类型、大小）
- ✅ XSS 防护（React 自动转义）
- ✅ 敏感信息不存储在前端

### 后端安全
- ✅ API 密钥环境变量存储
- ✅ CORS 配置
- ✅ 请求大小限制（10MB）
- ✅ 错误信息不暴露敏感细节

### API 密钥管理
```bash
# 设置密钥（不提交到 Git）
wrangler secret put DOUBAO_API_KEY
```

---

## 📊 性能优化

### 前端优化
1. **图片压缩**: 自动压缩至 1MB 以下
2. **懒加载**: 组件按需加载
3. **缓存**: LocalStorage 缓存历史记录
4. **动画**: CSS 动画优化

### 后端优化
1. **边缘计算**: Cloudflare Workers 全球分布
2. **无服务器**: 按需扩展，无冷启动
3. **重试机制**: 智能重试和退避
4. **超时控制**: 60-120 秒超时

### 网络优化
1. **压缩**: Gzip/Brotli 压缩
2. **CDN**: Cloudflare Pages CDN
3. **HTTP/2**: 多路复用

---

## 🧪 测试策略

### 单元测试
- 工具函数测试
- 数据解析测试
- 组件逻辑测试

### 集成测试
- API 通信测试
- 端到端流程测试

### 手动测试
- 不同图片类型
- 边界情况
- 错误处理

---

## 🚀 部署流程

### 前端部署
```bash
# 构建
npm run build

# 部署到 Cloudflare Pages
# (通过 Git 自动部署)
```

### 后端部署
```bash
# 进入 workers 目录
cd workers

# 部署
npm run deploy
```

### 环境变量
```bash
# 前端 (.env)
VITE_API_ENDPOINT=https://your-worker.workers.dev

# 后端 (Wrangler secrets)
DOUBAO_API_KEY=your-api-key
DOUBAO_API_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
```

---

## 📈 监控和日志

### 前端监控
- Console 日志
- 错误边界捕获
- 性能指标（待添加）

### 后端监控
- Cloudflare Workers 日志
- 错误追踪
- API 调用统计

---

## 🔄 版本历史

### v2.0.2 (2025-11-20)
- 修复白色文字显示问题
- 修复浮点数精度问题
- 修复分析中断问题
- 优化 UI 布局
- 增强健康建议功能

### v2.0.1
- 性能优化
- Bug 修复

### v2.0.0
- 全新 UI 设计
- 豆包 API 集成
- 历史记录功能

---

## 📚 技术文档

### 相关文档
- [README.md](./README.md) - 项目说明
- [docs/BUG_FIXES.md](./docs/BUG_FIXES.md) - Bug 修复记录
- [workers/DOUBAO_API_GUIDE.md](./workers/DOUBAO_API_GUIDE.md) - 豆包 API 指南

### 外部资源
- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [豆包 API 文档](https://www.volcengine.com/docs/82379)

---

**维护者**: Development Team  
**最后更新**: 2025-11-20
