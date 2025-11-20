#!/bin/bash

# 🚀 食物卡路里分析器 - 一键部署脚本
# 此脚本将自动部署前端和后端到 Cloudflare

set -e  # 遇到错误立即退出

echo "🍽️  食物卡路里分析器 - Cloudflare 部署"
echo "=========================================="
echo ""

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未检测到 wrangler CLI"
    echo "📦 正在安装 wrangler..."
    npm install -g wrangler
fi

echo "✅ Wrangler 已安装"
echo ""

# 检查是否已登录
echo "🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "📝 请登录 Cloudflare..."
    wrangler login
fi

echo "✅ 已登录 Cloudflare"
echo ""

# 构建前端
echo "🔨 构建前端应用..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ 构建失败：dist 目录不存在"
    exit 1
fi

echo "✅ 前端构建完成"
echo ""

# 部署 Workers API
echo "🚀 部署 Workers API..."
cd workers

if [ ! -f "wrangler.toml" ]; then
    echo "❌ 未找到 wrangler.toml 文件"
    exit 1
fi

wrangler deploy

echo "✅ Workers API 部署完成"
echo ""

# 获取 Workers URL
WORKER_URL=$(wrangler deployments list --json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")

if [ -z "$WORKER_URL" ]; then
    echo "⚠️  无法自动获取 Workers URL"
    echo "📝 请手动记录 Workers URL 并在 Pages 部署时配置"
else
    echo "📍 Workers API URL: $WORKER_URL"
fi

cd ..
echo ""

# 部署 Pages
echo "🚀 部署前端到 Cloudflare Pages..."
echo ""
echo "请选择部署方式："
echo "1) 使用 Wrangler 直接部署（快速）"
echo "2) 使用 Git 集成部署（推荐用于生产环境）"
echo "3) 跳过 Pages 部署"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo "📦 使用 Wrangler 部署 Pages..."
        read -p "请输入项目名称 (默认: food-calorie-analyzer): " project_name
        project_name=${project_name:-food-calorie-analyzer}
        
        wrangler pages deploy dist --project-name="$project_name"
        
        echo "✅ Pages 部署完成"
        echo "📍 访问: https://$project_name.pages.dev"
        ;;
    2)
        echo "📝 Git 集成部署步骤："
        echo "1. 将代码推送到 GitHub/GitLab"
        echo "2. 访问 https://dash.cloudflare.com"
        echo "3. 进入 Pages → Create a project"
        echo "4. 连接你的 Git 仓库"
        echo "5. 配置构建设置："
        echo "   - Build command: npm run build"
        echo "   - Build output directory: dist"
        if [ -n "$WORKER_URL" ]; then
            echo "6. 添加环境变量："
            echo "   - VITE_API_ENDPOINT: $WORKER_URL"
        fi
        ;;
    3)
        echo "⏭️  跳过 Pages 部署"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "🎉 部署完成！"
echo ""
echo "📋 后续步骤："
echo "1. 设置 Workers 环境变量（如果还没有）："
echo "   cd workers"
echo "   wrangler secret put DOUBAO_API_KEY"
echo "   wrangler secret put DOUBAO_API_ENDPOINT"
echo ""
echo "2. 测试应用功能"
echo "3. 配置自定义域名（可选）"
echo ""
echo "📚 详细文档: 查看 DEPLOYMENT_GUIDE.md"
echo "=========================================="
