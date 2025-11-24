#!/bin/bash

# 简化版部署脚本 - 快速部署到 Cloudflare Pages

set -e

echo "🚀 快速部署到 Cloudflare Pages"
echo ""

# 构建项目
echo "📦 构建项目..."
npm run build

# 部署
echo "☁️  部署到 Cloudflare Pages..."
wrangler pages deploy dist --project-name=food-calorie-analyzer --branch=main

echo ""
echo "✅ 部署完成！"
echo "🌐 访问: https://food-calorie-analyzer-qan.pages.dev"
