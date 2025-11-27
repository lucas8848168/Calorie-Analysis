#!/bin/bash

# 食物卡路里分析器 DEMO - 快速部署脚本
# 使用方法: chmod +x quick-start.sh && ./quick-start.sh

set -e

echo "🚀 食物卡路里分析器 DEMO - 快速部署"
echo "======================================"
echo ""

# 检查 Git
if ! command -v git &> /dev/null; then
    echo "❌ 错误: 未安装 Git"
    echo "请先安装 Git: https://git-scm.com/"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请先安装 Node.js 18+: https://nodejs.org/"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 清理旧的 Git 仓库
if [ -d ".git" ]; then
    echo "🗑️  清理旧的 Git 仓库..."
    rm -rf .git
fi

# 初始化 Git
echo "📦 初始化 Git 仓库..."
git init

# 配置 Git 用户信息
echo "👤 配置 Git 用户信息..."
read -p "请输入你的 GitHub 用户名 [Lucas]: " username
username=${username:-Lucas}

read -p "请输入你的 GitHub 邮箱 [lucas8848168@gmail.com]: " email
email=${email:-lucas8848168@gmail.com}

git config user.name "$username"
git config user.email "$email"

echo "✅ Git 配置完成"
echo ""

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/lucas8848168/Calorie-AnalysisDEMO.git

# 添加文件
echo "📝 添加文件到暂存区..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "Initial commit: Food Calorie Analyzer DEMO v2.0

- 整合前后端代码
- 配置 GitHub Actions 自动部署
- 更新文档和配置
- 清理临时文件"

# 推送
echo "🚀 推送到 GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "======================================"
echo "✅ 部署完成！"
echo ""
echo "📋 下一步:"
echo "1. 访问 GitHub 仓库: https://github.com/lucas8848168/Calorie-AnalysisDEMO"
echo "2. 进入 Settings → Pages"
echo "3. Source 选择 'GitHub Actions'"
echo "4. 等待部署完成（约 2-3 分钟）"
echo "5. 访问网站: https://lucas8848168.github.io/Calorie-AnalysisDEMO/"
echo ""
echo "🎉 祝你使用愉快！"
