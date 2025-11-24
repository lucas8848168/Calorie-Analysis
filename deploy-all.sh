#!/bin/bash

# ============================================
# 食物卡路里分析器 - 自动化部署脚本
# 作者: Lucas
# 日期: 2025-11-25
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示横幅
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║          🚀 食物卡路里分析器 - 自动化部署脚本                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# ============================================
# 阶段 0: 环境检查
# ============================================
echo -e "${BLUE}📋 阶段 0: 环境检查${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

# 检查 Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git: $(git --version | head -1)${NC}"

# 检查 Wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler 未安装，将跳过 Cloudflare 部署${NC}"
    WRANGLER_AVAILABLE=false
else
    echo -e "${GREEN}✅ Wrangler: $(wrangler --version | head -1)${NC}"
    WRANGLER_AVAILABLE=true
fi

echo ""

# ============================================
# 阶段 1: 构建项目
# ============================================
echo -e "${BLUE}📦 阶段 1: 构建项目${NC}"
echo ""

echo "安装依赖..."
npm ci

echo ""
echo "构建项目..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败: dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成${NC}"
echo ""

# ============================================
# 阶段 2: 部署选择
# ============================================
echo -e "${BLUE}🎯 阶段 2: 选择部署方式${NC}"
echo ""
echo "请选择部署方式:"
echo "  1) GitHub Pages (推送代码，自动部署)"
echo "  2) Cloudflare Pages (手动部署)"
echo "  3) 两者都部署"
echo "  4) 仅构建，不部署"
echo ""
read -p "请输入选项 (1-4): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        DEPLOY_GITHUB=true
        DEPLOY_CLOUDFLARE=false
        ;;
    2)
        DEPLOY_GITHUB=false
        DEPLOY_CLOUDFLARE=true
        ;;
    3)
        DEPLOY_GITHUB=true
        DEPLOY_CLOUDFLARE=true
        ;;
    4)
        echo -e "${GREEN}✅ 构建完成，跳过部署${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ 无效选项${NC}"
        exit 1
        ;;
esac

echo ""

# ============================================
# 阶段 3: 部署到 GitHub Pages
# ============================================
if [ "$DEPLOY_GITHUB" = true ]; then
    echo -e "${BLUE}📤 阶段 3: 部署到 GitHub Pages${NC}"
    echo ""
    
    # 检查 Git 状态
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  检测到未提交的更改${NC}"
        git status --short
        echo ""
        read -p "是否提交并推送? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "添加所有更改..."
            git add .
            
            echo "提交更改..."
            read -p "请输入提交信息 (留空使用默认): " COMMIT_MSG
            if [ -z "$COMMIT_MSG" ]; then
                COMMIT_MSG="deploy: 更新部署 $(date '+%Y-%m-%d %H:%M:%S')"
            fi
            git commit -m "$COMMIT_MSG"
        else
            echo -e "${YELLOW}⏭️  跳过提交${NC}"
        fi
    fi
    
    echo "推送到 GitHub..."
    if git push origin main; then
        echo -e "${GREEN}✅ 代码已推送到 GitHub${NC}"
        echo -e "${CYAN}🌐 GitHub Actions 将自动部署到:${NC}"
        echo -e "   https://lucas8848168.github.io/Calorie-Analysis/"
        echo ""
        echo -e "${CYAN}📊 查看部署状态:${NC}"
        echo -e "   https://github.com/lucas8848168/Calorie-Analysis/actions"
    else
        echo -e "${RED}❌ 推送失败${NC}"
        exit 1
    fi
    
    echo ""
fi

# ============================================
# 阶段 4: 部署到 Cloudflare Pages
# ============================================
if [ "$DEPLOY_CLOUDFLARE" = true ]; then
    echo -e "${BLUE}☁️  阶段 4: 部署到 Cloudflare Pages${NC}"
    echo ""
    
    if [ "$WRANGLER_AVAILABLE" = false ]; then
        echo -e "${RED}❌ Wrangler 未安装，无法部署到 Cloudflare${NC}"
        echo -e "${YELLOW}💡 安装方法: npm install -g wrangler${NC}"
        exit 1
    fi
    
    echo "选择 Cloudflare Pages 项目:"
    echo "  1) food-calorie-analyzer (food-calorie-analyzer-qan.pages.dev)"
    echo "  2) calorie-analysis-auto (calorie-analysis-auto.pages.dev)"
    echo ""
    read -p "请输入选项 (1-2): " CF_PROJECT_CHOICE
    
    case $CF_PROJECT_CHOICE in
        1)
            CF_PROJECT="food-calorie-analyzer"
            ;;
        2)
            CF_PROJECT="calorie-analysis-auto"
            ;;
        *)
            echo -e "${RED}❌ 无效选项${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo "部署到 Cloudflare Pages 项目: $CF_PROJECT"
    
    if wrangler pages deploy dist --project-name="$CF_PROJECT" --branch=main; then
        echo -e "${GREEN}✅ Cloudflare Pages 部署成功${NC}"
        echo -e "${CYAN}🌐 访问地址:${NC}"
        if [ "$CF_PROJECT" = "food-calorie-analyzer" ]; then
            echo -e "   https://food-calorie-analyzer-qan.pages.dev"
        else
            echo -e "   https://calorie-analysis-auto.pages.dev"
        fi
    else
        echo -e "${RED}❌ Cloudflare Pages 部署失败${NC}"
        echo -e "${YELLOW}💡 请检查:${NC}"
        echo -e "   1. 是否已登录 Wrangler (wrangler login)"
        echo -e "   2. 是否有部署权限"
        echo -e "   3. 项目名称是否正确"
        exit 1
    fi
    
    echo ""
fi

# ============================================
# 阶段 5: 部署 Workers API (可选)
# ============================================
echo -e "${BLUE}🔧 阶段 5: 部署 Workers API (可选)${NC}"
echo ""
read -p "是否部署 Workers API? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ "$WRANGLER_AVAILABLE" = false ]; then
        echo -e "${RED}❌ Wrangler 未安装，无法部署 Workers${NC}"
    else
        echo "进入 workers 目录..."
        cd workers
        
        echo "部署 Workers..."
        if npm run deploy; then
            echo -e "${GREEN}✅ Workers API 部署成功${NC}"
        else
            echo -e "${RED}❌ Workers API 部署失败${NC}"
            echo -e "${YELLOW}💡 请检查:${NC}"
            echo -e "   1. 是否已配置 Secrets (wrangler secret put)"
            echo -e "   2. 是否有部署权限"
        fi
        
        cd ..
    fi
else
    echo -e "${YELLOW}⏭️  跳过 Workers 部署${NC}"
fi

echo ""

# ============================================
# 完成
# ============================================
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 部署流程完成！                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📍 访问地址:${NC}"
if [ "$DEPLOY_GITHUB" = true ]; then
    echo -e "   GitHub Pages: https://lucas8848168.github.io/Calorie-Analysis/"
fi
if [ "$DEPLOY_CLOUDFLARE" = true ]; then
    echo -e "   Cloudflare Pages: https://food-calorie-analyzer-qan.pages.dev"
fi

echo ""
echo -e "${CYAN}📊 验证清单:${NC}"
echo -e "   [ ] 访问部署的 URL"
echo -e "   [ ] 测试用户登录"
echo -e "   [ ] 测试食物识别"
echo -e "   [ ] 检查历史记录"
echo -e "   [ ] 验证数据分析"

echo ""
echo -e "${PURPLE}感谢使用自动化部署脚本！${NC}"
echo ""
