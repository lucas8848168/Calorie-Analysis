@echo off
REM 🚀 食物卡路里分析器 - Windows 一键部署脚本

echo 🍽️  食物卡路里分析器 - Cloudflare 部署
echo ==========================================
echo.

REM 检查是否安装了 wrangler
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 wrangler CLI
    echo 📦 正在安装 wrangler...
    call npm install -g wrangler
)

echo ✅ Wrangler 已安装
echo.

REM 检查是否已登录
echo 🔐 检查 Cloudflare 登录状态...
wrangler whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 📝 请登录 Cloudflare...
    call wrangler login
)

echo ✅ 已登录 Cloudflare
echo.

REM 构建前端
echo 🔨 构建前端应用...
call npm run build

if not exist "dist" (
    echo ❌ 构建失败：dist 目录不存在
    exit /b 1
)

echo ✅ 前端构建完成
echo.

REM 部署 Workers API
echo 🚀 部署 Workers API...
cd workers

if not exist "wrangler.toml" (
    echo ❌ 未找到 wrangler.toml 文件
    exit /b 1
)

call wrangler deploy

echo ✅ Workers API 部署完成
echo.

cd ..

REM 部署 Pages
echo 🚀 部署前端到 Cloudflare Pages...
echo.
echo 请选择部署方式：
echo 1) 使用 Wrangler 直接部署（快速）
echo 2) 使用 Git 集成部署（推荐用于生产环境）
echo 3) 跳过 Pages 部署
echo.
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" (
    echo 📦 使用 Wrangler 部署 Pages...
    set /p project_name="请输入项目名称 (默认: food-calorie-analyzer): "
    if "%project_name%"=="" set project_name=food-calorie-analyzer
    
    call wrangler pages deploy dist --project-name=%project_name%
    
    echo ✅ Pages 部署完成
    echo 📍 访问: https://%project_name%.pages.dev
) else if "%choice%"=="2" (
    echo 📝 Git 集成部署步骤：
    echo 1. 将代码推送到 GitHub/GitLab
    echo 2. 访问 https://dash.cloudflare.com
    echo 3. 进入 Pages → Create a project
    echo 4. 连接你的 Git 仓库
    echo 5. 配置构建设置：
    echo    - Build command: npm run build
    echo    - Build output directory: dist
    echo 6. 添加环境变量：
    echo    - VITE_API_ENDPOINT: 你的 Workers URL
) else if "%choice%"=="3" (
    echo ⏭️  跳过 Pages 部署
) else (
    echo ❌ 无效选项
    exit /b 1
)

echo.
echo ==========================================
echo 🎉 部署完成！
echo.
echo 📋 后续步骤：
echo 1. 设置 Workers 环境变量（如果还没有）：
echo    cd workers
echo    wrangler secret put DOUBAO_API_KEY
echo    wrangler secret put DOUBAO_API_ENDPOINT
echo.
echo 2. 测试应用功能
echo 3. 配置自定义域名（可选）
echo.
echo 📚 详细文档: 查看 DEPLOYMENT_GUIDE.md
echo ==========================================

pause
