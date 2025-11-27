# 推送到 GitHub 指南

## 📋 准备工作

确保你已经：
1. ✅ 清理了项目（删除 demo 文件夹和临时文档）
2. ✅ 更新了配置文件
3. ✅ 创建了 GitHub 仓库: https://github.com/lucas8848168/Calorie-AnalysisDEMO.git

## 🚀 推送步骤

### 1. 初始化 Git（如果还没有）

```bash
# 如果已有 .git 文件夹，先删除旧的
rm -rf .git

# 初始化新的 Git 仓库
git init
```

### 2. 添加远程仓库

```bash
git remote add origin https://github.com/lucas8848168/Calorie-AnalysisDEMO.git
```

### 3. 添加文件到暂存区

```bash
# 添加所有文件
git add .

# 或者选择性添加
git add src/ functions/ public/ .github/
git add package.json vite.config.ts tsconfig.json
git add README.md DEPLOYMENT.md PROJECT_SUMMARY.md
git add .env.example .gitignore .prettierrc
```

### 4. 提交更改

```bash
git commit -m "Initial commit: Food Calorie Analyzer DEMO v2.0"
```

### 5. 推送到 GitHub

```bash
# 推送到 main 分支
git branch -M main
git push -u origin main
```

## 🔍 验证推送

推送成功后：

1. **查看仓库**
   - 访问 https://github.com/lucas8848168/Calorie-AnalysisDEMO
   - 确认所有文件已上传

2. **检查 GitHub Actions**
   - 进入 Actions 标签
   - 查看自动部署是否触发
   - 等待构建完成（约 2-3 分钟）

3. **启用 GitHub Pages**
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

4. **访问网站**
   - 部署完成后访问: https://lucas8848168.github.io/Calorie-AnalysisDEMO/
   - 测试功能是否正常

## 📝 .gitignore 检查

确保以下内容在 `.gitignore` 中：

```
# 依赖
node_modules/

# 构建输出
dist/
.wrangler/

# 环境变量
.env
.env.local
.env.*.local
.dev.vars

# 日志
logs/
*.log

# 系统文件
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# 临时文件
*.tmp
*.temp
```

## 🔐 环境变量处理

**重要**: 不要提交敏感信息！

1. **本地开发**
   - 使用 `.env` 文件（已在 .gitignore 中）
   - 提交 `.env.example` 作为模板

2. **生产环境**
   - 在 Cloudflare Pages Dashboard 配置
   - 不要在代码中硬编码 API 密钥

## 🔄 后续更新

### 日常开发流程

```bash
# 1. 修改代码
# 2. 测试功能
npm run dev

# 3. 构建验证
npm run build

# 4. 提交更改
git add .
git commit -m "描述你的更改"

# 5. 推送到 GitHub
git push origin main
```

### 创建新分支

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 开发完成后推送
git push origin feature/new-feature

# 在 GitHub 上创建 Pull Request
```

## 🐛 常见问题

### Q: 推送失败，提示 "remote: Permission denied"

A: 检查 GitHub 认证：
```bash
# 使用 HTTPS（需要 Personal Access Token）
git remote set-url origin https://github.com/lucas8848168/Calorie-AnalysisDEMO.git

# 或使用 SSH
git remote set-url origin git@github.com:lucas8848168/Calorie-AnalysisDEMO.git
```

### Q: 推送失败，提示 "Updates were rejected"

A: 先拉取远程更改：
```bash
git pull origin main --rebase
git push origin main
```

### Q: 不小心提交了敏感信息怎么办？

A: 立即从历史中删除：
```bash
# 删除文件并从历史中移除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

### Q: 如何查看提交历史？

A: 
```bash
# 查看提交日志
git log --oneline

# 查看详细信息
git log --stat

# 图形化查看
git log --graph --oneline --all
```

## 📊 推送清单

推送前检查：

- [ ] 删除了 demo-frontend-only 文件夹
- [ ] 删除了所有临时文档
- [ ] 更新了 vite.config.ts 中的 base path
- [ ] 更新了 package.json 中的仓库信息
- [ ] 创建了 GitHub Actions 配置
- [ ] 更新了 README.md
- [ ] 创建了 DEPLOYMENT.md
- [ ] 检查了 .gitignore
- [ ] 没有提交 .env 文件
- [ ] 本地构建成功 (`npm run build`)
- [ ] 本地测试通过 (`npm run dev`)

## 🎉 完成

推送成功后，你的项目将：

1. ✅ 托管在 GitHub
2. ✅ 自动部署到 GitHub Pages
3. ✅ 可以通过 URL 访问
4. ✅ 支持持续集成/部署

---

**祝你部署顺利！** 🚀
