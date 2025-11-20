# 🔄 GitHub 自动部署配置

## 📋 概述

现在你有**两个独立的部署**：

### 1️⃣ 手动部署版本（现有）
- 📍 URL: https://7e4ab626.food-calorie-analyzer-qan.pages.dev
- 🔧 部署方式: 使用 `wrangler pages deploy` 命令
- 📦 项目名: `food-calorie-analyzer`
- ✅ 状态: 已部署，正常运行

### 2️⃣ GitHub 自动部署版本（新增）
- 📍 URL: https://food-calorie-analyzer-github.pages.dev（首次部署后生成）
- 🔧 部署方式: Git push 自动触发
- 📦 项目名: `food-calorie-analyzer-github`
- 🚀 特点: 每次 push 到 main/master 分支自动部署

---

## ✅ 已完成的配置

我已经创建了 `.github/workflows/deploy.yml` 文件，配置了：
- ✅ 自动构建流程
- ✅ 使用正确的 API 端点
- ✅ 部署到独立的 Pages 项目
- ✅ 不影响现有部署

---

## 🔑 需要你完成的步骤

### 步骤 1: 获取 Cloudflare API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 或者使用 **Custom token**，需要以下权限：
   - Account - Cloudflare Pages: Edit
   - Account - Account Settings: Read
5. 点击 **Continue to summary**
6. 点击 **Create Token**
7. **复制生成的 Token**（只显示一次！）

### 步骤 2: 在 GitHub 仓库中添加 Secret

1. 打开你的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加 Secret：
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 粘贴你刚才复制的 Token
5. 点击 **Add secret**

### 步骤 3: 推送代码到 GitHub

```bash
# 如果还没有添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 添加所有文件
git add .

# 提交
git commit -m "Add GitHub Actions auto-deploy"

# 推送到 GitHub
git push -u origin main
# 或者如果你的主分支是 master
# git push -u origin master
```

### 步骤 4: 查看部署进度

1. 推送后，访问你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 你会看到 "Deploy to Cloudflare Pages" 工作流正在运行
4. 点击查看详细日志
5. 部署完成后，会显示 Pages URL

---

## 🌐 两个部署的区别

| 特性 | 手动部署 | GitHub 自动部署 |
|------|---------|----------------|
| **URL** | `7e4ab626.food-calorie-analyzer-qan.pages.dev` | `food-calorie-analyzer-github.pages.dev` |
| **项目名** | `food-calorie-analyzer` | `food-calorie-analyzer-github` |
| **部署方式** | 运行 `wrangler pages deploy` | Git push 自动触发 |
| **更新方式** | 手动运行命令 | 自动（push 后） |
| **适用场景** | 快速测试、手动控制 | 生产环境、团队协作 |
| **部署历史** | Cloudflare Dashboard | GitHub Actions + Cloudflare |

---

## 🔄 工作流程说明

### 自动部署触发条件
- ✅ Push 到 `main` 或 `master` 分支
- ✅ 创建 Pull Request 到 `main` 或 `master`

### 部署步骤（自动执行）
1. 📥 检出代码
2. 📦 安装 Node.js 18
3. 📚 安装依赖 (`npm ci`)
4. 🔨 构建项目 (`npm run build`)
   - 自动使用生产 API 端点
5. 🚀 部署到 Cloudflare Pages
   - 项目名: `food-calorie-analyzer-github`
   - 账号 ID: `aa8354c5e26025fcd852968f46144596`

### 部署时间
- 预计 3-5 分钟完成整个流程

---

## 📊 管理两个部署

### 在 Cloudflare Dashboard 查看

访问 https://dash.cloudflare.com → Workers & Pages

你会看到两个项目：
1. **food-calorie-analyzer** - 手动部署版本
2. **food-calorie-analyzer-github** - GitHub 自动部署版本

每个项目都有独立的：
- 📈 Analytics（访问统计）
- 🚀 Deployments（部署历史）
- ⚙️ Settings（环境变量、域名）

### 选择使用哪个版本

**推荐使用 GitHub 自动部署版本作为主要版本：**
- ✅ 自动化，省时省力
- ✅ 有完整的部署历史
- ✅ 支持 Pull Request 预览
- ✅ 适合团队协作

**保留手动部署版本用于：**
- 🧪 快速测试新功能
- 🔧 紧急修复
- 🎯 实验性更新

---

## 🎯 后续操作建议

### 1. 配置自定义域名（可选）

如果你有域名，可以为两个部署配置不同的子域名：
- `app.yourdomain.com` → GitHub 自动部署（生产）
- `test.yourdomain.com` → 手动部署（测试）

### 2. 设置部署通知

在 GitHub 仓库设置中：
- Settings → Notifications
- 配置部署成功/失败的邮件通知

### 3. 添加部署状态徽章

在 README.md 中添加：
```markdown
[![Deploy Status](https://github.com/你的用户名/你的仓库名/actions/workflows/deploy.yml/badge.svg)](https://github.com/你的用户名/你的仓库名/actions)
```

---

## 🐛 故障排除

### 问题 1: GitHub Actions 失败
**检查：**
- ✅ 是否添加了 `CLOUDFLARE_API_TOKEN` Secret
- ✅ Token 是否有正确的权限
- ✅ 查看 Actions 日志中的错误信息

### 问题 2: 构建失败
**检查：**
- ✅ `package.json` 中的依赖是否完整
- ✅ 本地 `npm run build` 是否成功
- ✅ 查看 Actions 日志

### 问题 3: 部署成功但应用无法访问
**检查：**
- ✅ API 端点是否正确配置
- ✅ 在 Cloudflare Dashboard 查看部署状态
- ✅ 检查浏览器控制台错误

---

## 📚 相关文档

- GitHub Actions 文档: https://docs.github.com/actions
- Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
- Cloudflare Pages GitHub Action: https://github.com/cloudflare/pages-action

---

## 🎉 完成后的效果

推送代码到 GitHub 后：
1. ✅ GitHub Actions 自动触发
2. ✅ 自动构建项目
3. ✅ 自动部署到 Cloudflare Pages
4. ✅ 获得新的部署 URL
5. ✅ 可以在 GitHub 和 Cloudflare 查看部署状态

**现在按照上面的步骤操作即可！** 🚀

---

## 💡 提示

如果你想要我帮你推送代码到 GitHub，请告诉我：
1. GitHub 仓库的 URL
2. 你是否已经配置了 Git remote

我可以帮你生成推送命令！
