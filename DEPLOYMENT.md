# 部署指南

本项目支持两种部署方式：GitHub Pages（仅前端演示）和 Cloudflare Pages（完整功能）。

## 📋 目录

- [GitHub Pages 部署](#github-pages-部署)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## GitHub Pages 部署

### 自动部署（推荐）

项目已配置 GitHub Actions，推送到 `main` 分支会自动部署。

1. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **推送代码**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **访问网站**
   - 部署完成后访问: https://lucas8848168.github.io/Calorie-AnalysisDEMO/

### 手动部署

```bash
# 构建项目
npm run build

# 部署到 gh-pages 分支（需要安装 gh-pages）
npm install -g gh-pages
gh-pages -d dist
```

## Cloudflare Pages 部署

Cloudflare Pages 支持完整的前后端功能，包括 AI 识别。

### 步骤 1: 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Workers & Pages" → "Create application" → "Pages"
3. 连接 GitHub 仓库: `lucas8848168/Calorie-AnalysisDEMO`

### 步骤 2: 配置构建设置

- **Framework preset**: None
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

### 步骤 3: 配置环境变量

在 Settings → Environment variables 添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DOUBAO_API_KEY` | 你的豆包 API 密钥 | 必需，用于 AI 识别 |
| `DOUBAO_API_ENDPOINT` | `https://ark.cn-beijing.volces.com/api/v3` | 可选，默认值 |

### 步骤 4: 部署

1. 点击 "Save and Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 访问分配的域名（如 `your-project.pages.dev`）

### 步骤 5: 自定义域名（可选）

1. 进入 Custom domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 环境变量配置

### 开发环境 (.env)

```bash
# API 端点（开发时使用本地 Workers）
VITE_API_ENDPOINT=http://localhost:8787

# 管理员配置（可选）
VITE_ADMIN_DEVICES=admin,test_admin
VITE_ADMIN_PASSWORD=admin123
```

### 生产环境

#### GitHub Pages
- 不需要配置环境变量
- 前端使用相对路径调用 API（需要配合 Cloudflare Pages Functions）

#### Cloudflare Pages
- 在 Dashboard 中配置环境变量
- 支持 Production 和 Preview 环境分别配置

## 项目结构

```
/
├── src/                    # 前端源码
├── functions/              # Cloudflare Pages Functions（后端 API）
│   └── api/
│       ├── analyze.ts      # 食物分析 API
│       └── health.ts       # 健康检查 API
├── dist/                   # 构建输出
├── .github/workflows/      # GitHub Actions 配置
└── vite.config.ts          # Vite 配置
```

## 构建说明

### 前端构建

```bash
npm run build
```

输出到 `dist/` 目录，包含：
- 静态资源（HTML, CSS, JS）
- PWA 资源（Service Worker, Manifest）
- Cloudflare Pages Functions（`dist/functions/`）

### 本地预览

```bash
npm run preview
```

访问 http://localhost:4173

## 常见问题

### Q: GitHub Pages 部署后无法使用 AI 识别功能？

A: GitHub Pages 只部署前端，AI 功能需要后端支持。有两个解决方案：
1. 同时部署到 Cloudflare Pages（推荐）
2. 配置 `VITE_API_ENDPOINT` 指向独立的 Cloudflare Workers

### Q: Cloudflare Pages 构建失败？

A: 检查以下几点：
1. Node.js 版本是否为 18+
2. 构建命令是否正确: `npm run build`
3. 输出目录是否正确: `dist`
4. 依赖是否正确安装

### Q: API 调用失败，返回 500 错误？

A: 检查环境变量：
1. `DOUBAO_API_KEY` 是否正确配置
2. API 密钥是否有效
3. 查看 Functions 日志排查问题

### Q: 如何查看 Cloudflare Pages Functions 日志？

A: 
1. 进入 Cloudflare Dashboard
2. Workers & Pages → 你的项目
3. 点击 "View logs" 或 "Real-time logs"

### Q: 如何更新部署？

A: 
- **GitHub Pages**: 推送代码到 `main` 分支自动部署
- **Cloudflare Pages**: 推送代码到连接的分支自动部署

### Q: 如何回滚部署？

A:
- **GitHub Pages**: 在 Actions 中重新运行之前的工作流
- **Cloudflare Pages**: 在 Deployments 中选择之前的部署并 "Rollback"

## 性能优化

### 构建优化

- 代码分割（Code Splitting）
- Tree Shaking
- 资源压缩（Gzip/Brotli）
- 图片优化

### 运行时优化

- Service Worker 缓存
- 懒加载（Lazy Loading）
- 预加载（Preloading）
- CDN 加速

## 监控和分析

### Cloudflare Analytics

1. 进入项目 Dashboard
2. 查看 Analytics 标签
3. 监控：
   - 请求数量
   - 带宽使用
   - 错误率
   - 响应时间

### 自定义监控

可以集成第三方监控服务：
- Google Analytics
- Sentry（错误追踪）
- LogRocket（用户行为）

## 安全建议

1. **API 密钥保护**
   - 不要在前端代码中硬编码 API 密钥
   - 使用环境变量存储敏感信息
   - 定期轮换 API 密钥

2. **CORS 配置**
   - 限制允许的域名
   - 使用 HTTPS

3. **速率限制**
   - 在 API 层面实施速率限制
   - 防止滥用

## 成本估算

### GitHub Pages
- **免费**
- 限制：100GB 带宽/月，100 次构建/小时

### Cloudflare Pages
- **免费套餐**:
  - 500 次构建/月
  - 无限请求
  - 100,000 次 Functions 调用/天
- **付费套餐**: $20/月起

### 豆包 API
- 根据调用次数计费
- 查看 [豆包定价](https://www.volcengine.com/pricing/doubao)

## 技术支持

遇到问题？

1. 查看 [GitHub Issues](https://github.com/lucas8848168/Calorie-AnalysisDEMO/issues)
2. 提交新的 Issue
3. 联系作者: lucas8848168@gmail.com

---

**最后更新**: 2025-11-28
