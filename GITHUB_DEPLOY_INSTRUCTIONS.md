# 🚀 GitHub 自动部署操作指南

## 📋 仓库信息
- **GitHub 仓库**: https://github.com/lucas8848168/Calorie-Analysis
- **部署目标**: Cloudflare Pages（仅前端）
- **后端服务**: 保持不变，继续使用现有 Workers API

---

## ✅ 第一步：推送代码到 GitHub

### 方法 1：使用命令行（推荐）

```bash
# 1. 检查当前 Git 状态
git status

# 2. 添加远程仓库（如果还没添加）
git remote add origin https://github.com/lucas8848168/Calorie-Analysis.git

# 3. 查看远程仓库配置
git remote -v

# 4. 添加所有文件
git add .

# 5. 提交更改
git commit -m "Setup GitHub Actions for frontend auto-deploy"

# 6. 推送到 GitHub
git push -u origin main
```

### 如果遇到分支名问题

```bash
# 查看当前分支
git branch

# 如果是 master 分支，推送到 master
git push -u origin master

# 或者重命名为 main
git branch -M main
git push -u origin main
```

---

## ✅ 第二步：获取 Cloudflare API Token

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **"Create Token"**
3. 选择 **"Edit Cloudflare Workers"** 模板
4. 或者使用自定义模板，权限设置为：
   - **Account** → **Cloudflare Pages** → **Edit**
5. 点击 **"Continue to summary"** → **"Create Token"**
6. **复制 Token**（只显示一次，请妥善保存！）

---

## ✅ 第三步：在 GitHub 添加 Secret

1. 打开仓库：https://github.com/lucas8848168/Calorie-Analysis
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **"New repository secret"**
5. 添加 Secret：
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Secret**: 粘贴你刚才复制的 Token
6. 点击 **"Add secret"**

---

## ✅ 第四步：验证自动部署

1. 访问：https://github.com/lucas8848168/Calorie-Analysis/actions
2. 查看 **"Deploy to Cloudflare Pages"** 工作流
3. 等待部署完成（通常 2-5 分钟）
4. 部署成功后，访问你的应用

---

## 🌐 部署地址

### 自动部署版本（新）
- **URL**: https://food-calorie-analyzer-github.pages.dev
- **触发方式**: 每次 push 到 main/master 分支自动部署
- **用途**: 生产环境

### 后端 API（保持不变）
- **URL**: https://food-analyzer-api.lucas8848.workers.dev
- **说明**: 后端服务完全不受影响，继续正常运行

---

## 🔄 日常开发流程

以后你只需要：

```bash
# 1. 修改代码
# ... 编辑文件 ...

# 2. 本地测试
npm run dev

# 3. 提交并推送
git add .
git commit -m "Update feature"
git push

# 4. 自动部署！
# GitHub Actions 会自动构建并部署到 Cloudflare Pages
```

---

## 🛠️ 配置说明

### GitHub Actions 做了什么？

查看 `.github/workflows/deploy.yml`：

1. ✅ **只构建前端**：运行 `npm run build`
2. ✅ **只部署 dist 目录**：前端构建产物
3. ✅ **使用生产 API**：`https://food-analyzer-api.lucas8848.workers.dev`
4. ✅ **不触碰后端**：`workers/` 目录完全不受影响

### 不会做什么？

- ❌ 不会部署后端 Workers
- ❌ 不会运行 `wrangler deploy`
- ❌ 不会修改 API 服务

---

## 🆘 常见问题

### Q1: 推送失败怎么办？

```bash
# 如果提示需要先 pull
git pull origin main --rebase
git push origin main

# 如果提示权限问题
# 检查 GitHub 账号是否有仓库的写入权限
```

### Q2: GitHub Actions 失败怎么办？

1. 检查是否正确添加了 `CLOUDFLARE_API_TOKEN`
2. 查看 Actions 日志中的具体错误信息
3. 确认 Token 权限是否正确

### Q3: 部署成功但无法访问？

1. 等待 DNS 传播（可能需要几分钟）
2. 检查 Cloudflare Dashboard 中的项目状态
3. 确认项目名称是否正确：`food-calorie-analyzer-github`

### Q4: 如何查看部署日志？

访问：https://github.com/lucas8848168/Calorie-Analysis/actions
点击最新的工作流运行记录查看详细日志

---

## 📊 监控和管理

### GitHub Actions
- **查看部署历史**: https://github.com/lucas8848168/Calorie-Analysis/actions
- **重新部署**: 点击工作流 → "Re-run jobs"
- **查看日志**: 点击具体的运行记录

### Cloudflare Dashboard
- **访问**: https://dash.cloudflare.com
- **导航**: Workers & Pages → food-calorie-analyzer-github
- **查看**: 部署历史、访问统计、日志

---

## 🎉 完成后的效果

✅ **自动化部署**：push 代码即自动部署
✅ **前后端分离**：前端自动部署，后端保持稳定
✅ **零停机更新**：Cloudflare Pages 自动处理
✅ **版本控制**：每次部署都有完整的 Git 历史

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. 具体的错误信息
2. GitHub Actions 日志截图
3. 当前进行到哪一步

祝部署顺利！🚀
