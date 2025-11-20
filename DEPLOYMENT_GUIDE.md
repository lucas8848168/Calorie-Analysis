# 🚀 Cloudflare 部署指南

本指南将帮助你将食物卡路里分析器部署到 Cloudflare Pages 和 Workers。

## 📋 部署前准备

### 1. 确认构建成功
```bash
npm run build
```
✅ 构建应该成功完成，生成 `dist/` 目录

### 2. 准备 Cloudflare 账号
- Cloudflare 账号 ID: `aa8354c5e26025fcd852968f46144596`
- 确保已登录 Cloudflare Dashboard

### 3. 准备 API 密钥
- 方舟豆包 API Key (DOUBAO_API_KEY)
- 方舟豆包 API Endpoint (DOUBAO_API_ENDPOINT)

## 🎯 部署步骤

### 方案 A: 使用 Wrangler CLI（推荐）

#### 1. 安装 Wrangler
```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare
```bash
wrangler login
```

#### 3. 部署 Workers API
```bash
cd workers
wrangler deploy
```

#### 4. 设置 Workers 环境变量
```bash
# 设置豆包 API Key
wrangler secret put DOUBAO_API_KEY
# 输入你的 API Key

# 设置豆包 API Endpoint（如果需要）
wrangler secret put DOUBAO_API_ENDPOINT
# 输入 API Endpoint URL
```

#### 5. 部署前端到 Cloudflare Pages

**选项 1: 通过 Git 自动部署（推荐）**
1. 将代码推送到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 Pages → Create a project
4. 连接你的 Git 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
6. 添加环境变量：
   - `VITE_API_ENDPOINT`: 你的 Workers API URL (例如: `https://food-analyzer-api.your-subdomain.workers.dev`)
7. 点击 Deploy

**选项 2: 使用 Wrangler 直接部署**
```bash
# 在项目根目录
wrangler pages deploy dist --project-name=food-calorie-analyzer
```

### 方案 B: 使用 Cloudflare Dashboard 手动部署

#### 1. 部署 Workers
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 点击 Create Application → Create Worker
4. 复制 `workers/src/worker.ts` 的内容
5. 粘贴到 Worker 编辑器
6. 点击 Save and Deploy
7. 在 Settings → Variables 中添加环境变量

#### 2. 部署 Pages
1. 在 Workers & Pages 中点击 Create Application → Pages
2. 选择 Upload assets
3. 上传 `dist/` 目录中的所有文件
4. 配置环境变量
5. 点击 Deploy

## 🔧 部署后配置

### 1. 更新前端 API 端点
如果你的 Workers API URL 不同，需要更新前端配置：

创建 `.env.production` 文件：
```env
VITE_API_ENDPOINT=https://food-analyzer-api.your-subdomain.workers.dev
```

然后重新构建和部署：
```bash
npm run build
wrangler pages deploy dist --project-name=food-calorie-analyzer
```

### 2. 配置自定义域名（可选）
1. 在 Cloudflare Pages 设置中添加自定义域名
2. 更新 DNS 记录
3. 等待 SSL 证书自动配置

### 3. 配置 CORS（如果需要）
Workers 代码已经包含 CORS 配置，如果需要修改允许的域名，编辑 `workers/src/worker.ts`：

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.pages.dev',
  // ...
};
```

## ✅ 验证部署

### 1. 测试 Workers API
```bash
curl https://food-analyzer-api.your-subdomain.workers.dev/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 2. 测试前端应用
访问你的 Pages URL: `https://food-calorie-analyzer.pages.dev`

测试功能：
- ✅ 上传图片
- ✅ 查看分析结果
- ✅ 历史记录
- ✅ 数据分析
- ✅ 目标管理

## 🐛 常见问题

### 问题 1: Workers 部署失败
**解决方案**:
```bash
# 检查 wrangler 版本
wrangler --version

# 更新 wrangler
npm install -g wrangler@latest

# 重新登录
wrangler logout
wrangler login
```

### 问题 2: API 调用失败 (CORS 错误)
**解决方案**:
- 检查 Workers 中的 CORS 配置
- 确保前端使用正确的 API URL
- 检查浏览器控制台的错误信息

### 问题 3: 环境变量未生效
**解决方案**:
```bash
# 检查 Workers 环境变量
wrangler secret list

# 重新设置
wrangler secret put DOUBAO_API_KEY
```

### 问题 4: 构建文件过大
**解决方案**:
- 已经配置了代码分割和压缩
- 如果仍然过大，考虑使用动态导入
- 检查是否有不必要的依赖

## 📊 监控和日志

### 查看 Workers 日志
```bash
wrangler tail
```

### 查看 Pages 部署日志
1. 登录 Cloudflare Dashboard
2. 进入 Pages → 你的项目
3. 查看 Deployments 标签

## 🔄 更新部署

### 更新 Workers
```bash
cd workers
wrangler deploy
```

### 更新 Pages
如果使用 Git 集成，只需推送代码：
```bash
git add .
git commit -m "Update application"
git push
```

如果使用 Wrangler：
```bash
npm run build
wrangler pages deploy dist --project-name=food-calorie-analyzer
```

## 💰 成本估算

基于 Cloudflare 免费套餐：
- ✅ Workers: 100,000 请求/天（免费）
- ✅ Pages: 无限请求（免费）
- ✅ KV 存储: 100,000 读取/天（免费）
- ✅ 带宽: 无限（免费）

**预计成本**: $0/月（在免费额度内）

## 🎉 部署完成

恭喜！你的食物卡路里分析器已经成功部署到 Cloudflare。

**下一步**:
1. 分享你的应用 URL
2. 收集用户反馈
3. 持续优化和改进

**需要帮助？**
- 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- 查看项目 README.md
