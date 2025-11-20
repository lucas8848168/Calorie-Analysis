# 🚀 GitHub 自动部署 - 完整设置指南

## ✅ 已完成的准备工作

我已经为你创建了：
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 配置文件
- ✅ 配置了自动构建和部署流程
- ✅ 使用独立的项目名 `food-calorie-analyzer-github`
- ✅ 不会影响现有的手动部署

---

## 📝 完整操作步骤

### 第 1 步：获取 Cloudflare API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 使用 **Edit Cloudflare Workers** 模板
4. 或创建 **Custom token**，权限设置：
   ```
   Account - Cloudflare Pages: Edit
   Account - Account Settings: Read
   ```
5. 点击 **Continue to summary** → **Create Token**
6. **复制 Token**（只显示一次，请妥善保存！）

### 第 2 步：配置 GitHub 仓库

#### 2.1 添加 Cloudflare API Token

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加 Secret：
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Secret**: 粘贴你的 Cloudflare API Token
6. 点击 **Add secret**

### 第 3 步：推送代码到 GitHub

#### 3.1 检查 Git 状态
```bash
git status
```

#### 3.2 添加远程仓库（如果还没有）
```bash
# 替换为你的 GitHub 仓库 URL
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 验证
git remote -v
```

#### 3.3 添加并提交文件
```bash
# 添加所有文件
git add .

# 提交
git commit -m "Add GitHub Actions auto-deploy configuration"
```

#### 3.4 推送到 GitHub
```bash
# 如果主分支是 main
git push -u origin main

# 如果主分支是 master
git push -u origin master

# 如果不确定，可以先查看当前分支
git branch
```

### 第 4 步：查看自动部署

1. 推送完成后，访问你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 你会看到 "Deploy to Cloudflare Pages" 工作流正在运行
4. 点击工作流查看实时日志
5. 等待 3-5 分钟完成部署

### 第 5 步：获取新的部署 URL

部署完成后，有两种方式查看 URL：

**方式 1: 在 GitHub Actions 日志中**
- 在 Actions 日志的最后会显示部署 URL

**方式 2: 在 Cloudflare Dashboard 中**
1. 访问 https://dash.cloudflare.com
2. 进入 **Workers & Pages**
3. 找到 `food-calorie-analyzer-github` 项目
4. 查看部署 URL

---

## 🎯 两个部署的使用场景

### 手动部署版本
**URL**: https://7e4ab626.food-calorie-analyzer-qan.pages.dev

**适用于：**
- 🧪 快速测试新功能
- 🔧 紧急修复验证
- 🎯 实验性更新
- 💡 本地开发后的快速预览

**更新方式：**
```bash
npm run build
wrangler pages deploy dist --project-name=food-calorie-analyzer
```

### GitHub 自动部署版本
**URL**: https://food-calorie-analyzer-github.pages.dev

**适用于：**
- 🌟 生产环境
- 👥 团队协作
- 📦 正式发布
- 🔄 持续集成/部署

**更新方式：**
```bash
git add .
git commit -m "Update feature"
git push
# 自动触发部署！
```

---

## 🔄 日常工作流程

### 开发新功能
```bash
# 1. 创建新分支（可选）
git checkout -b feature/new-feature

# 2. 修改代码
# ... 编辑文件 ...

# 3. 本地测试
npm run dev

# 4. 构建测试
npm run build

# 5. 手动部署测试（可选）
wrangler pages deploy dist --project-name=food-calorie-analyzer

# 6. 提交代码
git add .
git commit -m "Add new feature"

# 7. 推送到 GitHub
git push origin feature/new-feature

# 8. 创建 Pull Request
# 在 GitHub 网页上创建 PR

# 9. 合并到 main 后自动部署到生产环境
```

### 紧急修复
```bash
# 1. 修复代码
# ... 编辑文件 ...

# 2. 快速测试
npm run build
wrangler pages deploy dist --project-name=food-calorie-analyzer

# 3. 验证修复后推送
git add .
git commit -m "Fix critical bug"
git push

# 自动部署到生产环境
```

---

## 📊 监控和管理

### GitHub Actions
- 查看部署历史: GitHub 仓库 → Actions
- 查看部署日志: 点击具体的工作流运行
- 重新运行部署: 点击 "Re-run jobs"

### Cloudflare Dashboard
- 查看两个项目: https://dash.cloudflare.com → Workers & Pages
- 查看访问统计: 点击项目 → Analytics
- 管理环境变量: 点击项目 → Settings → Environment variables
- 配置自定义域名: 点击项目 → Custom domains

---

## 🎨 可选优化

### 1. 添加 Pull Request 预览

修改 `.github/workflows/deploy.yml`，PR 会自动创建预览环境：
```yaml
on:
  pull_request:
    branches:
      - main
```

### 2. 添加部署状态徽章

在 `README.md` 中添加：
```markdown
[![Deploy Status](https://github.com/你的用户名/你的仓库名/actions/workflows/deploy.yml/badge.svg)](https://github.com/你的用户名/你的仓库名/actions)
```

### 3. 配置不同环境的 API 端点

如果需要测试环境使用不同的 API：
```yaml
# 在 .github/workflows/deploy.yml 中
env:
  VITE_API_ENDPOINT: ${{ github.ref == 'refs/heads/main' && 'https://food-analyzer-api.lucas8848.workers.dev' || 'https://food-analyzer-api-dev.lucas8848.workers.dev' }}
```

---

## 🆘 常见问题

### Q: GitHub Actions 失败了怎么办？
**A**: 
1. 检查是否添加了 `CLOUDFLARE_API_TOKEN` S