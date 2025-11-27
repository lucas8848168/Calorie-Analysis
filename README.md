# 🍽️ 食物卡路里分析器 DEMO

一个基于 AI 的智能食物识别和营养分析系统，帮助你轻松追踪饮食和管理健康目标。

**🎯 在线演示**: https://lucas8848168.github.io/Calorie-AnalysisDEMO/

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)

## ✨ 核心功能

### 🤖 智能识别
- 📸 拍照即可识别食物并计算卡路里
- 🎯 支持多种食物同时识别
- 📊 自动估算食物重量和分量
- 💡 提供详细的营养成分分析

### 📈 健康管理
- 🎯 个性化健康目标设置（减重/增肌/维持）
- 📊 智能营养目标计算（基于 BMR/TDEE）
- 📈 每日进度追踪和可视化
- 🏆 连续达标天数统计

### 💡 AI 建议
- 🤖 基于历史数据的个性化饮食建议
- ⚖️ 营养均衡度分析
- 🥗 健康食物推荐
- ⚠️ 营养摄入预警

### 📱 现代体验
- 📱 PWA 支持，可安装到手机
- 🔄 离线功能，无网络也能使用
- 🎨 响应式设计，适配各种设备
- ⚡ 快速加载，流畅体验

## 🚀 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: 原生 CSS3（响应式设计）
- **图表**: Recharts
- **PWA**: Service Worker + Manifest
- **存储**: IndexedDB + LocalStorage

### 后端
- **平台**: Cloudflare Pages Functions（Serverless）
- **AI**: 豆包 1.6 Vision API
- **部署**: GitHub Pages + Cloudflare Pages

## 📦 快速开始

### 前提条件
- Node.js 18+
- npm 或 yarn

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/lucas8848168/Calorie-AnalysisDEMO.git
cd Calorie-AnalysisDEMO

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录，包含前端和 Cloudflare Pages Functions。

## 🌐 部署

### GitHub Pages 部署（前端）

项目已配置 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建并部署到 GitHub Pages
3. 访问 https://lucas8848168.github.io/Calorie-AnalysisDEMO/

### Cloudflare Pages 部署（前后端）

如需完整功能（包括 AI 识别），需要部署到 Cloudflare Pages：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 创建 Pages 项目，连接此 GitHub 仓库
3. 配置构建设置：
   - 构建命令: `npm run build`
   - 输出目录: `dist`
4. 添加环境变量：
   - `DOUBAO_API_KEY`: 豆包 API 密钥
   - `DOUBAO_API_ENDPOINT`: `https://ark.cn-beijing.volces.com/api/v3`
5. 部署完成后访问分配的域名

## 🎯 使用指南

### 1. 注册账号
首次使用需要创建账号，所有数据存储在本地浏览器中，保护隐私。

### 2. 设置个人信息
填写身高、体重、年龄等信息，系统会自动计算基础代谢率（BMR）和每日总能量消耗（TDEE）。

### 3. 创建健康目标
- 选择目标类型：减重、增肌、维持体重或健康饮食
- 设置目标体重和时间
- 系统自动计算每日卡路里和营养目标

### 4. 识别食物
- 点击上传按钮或拍照
- AI 自动识别食物并计算营养
- 查看详细的营养分析和健康建议
- 保存到历史记录

### 5. 追踪进度
在数据分析页面查看：
- 每日营养摄入趋势图
- 目标完成进度
- 营养素分布饼图
- 连续达标天数

## 🔒 隐私保护

- ✅ 所有用户数据存储在本地浏览器
- ✅ 不上传个人信息到服务器
- ✅ 仅上传食物图片用于识别
- ✅ 图片不会被保存
- ✅ 符合 GDPR 和隐私法规

## 📱 PWA 安装

### iOS
1. 在 Safari 中打开应用
2. 点击分享按钮
3. 选择"添加到主屏幕"

### Android
1. 在 Chrome 中打开应用
2. 点击菜单
3. 选择"安装应用"

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 使用 Prettier 格式化代码
- 编写清晰的注释

## 📄 许可证

本项目采用 ISC 许可证。详见 [LICENSE](LICENSE) 文件。

## 👨‍💻 作者

**Lucas**

- GitHub: [@lucas8848168](https://github.com/lucas8848168)
- Email: lucas8848168@gmail.com

## 🙏 致谢

- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Recharts](https://recharts.org/) - 图表库
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台
- [豆包 AI](https://www.volcengine.com/product/doubao) - AI 识别服务

## ⚠️ 免责声明

本应用提供的营养数据和健康建议仅供参考，不能替代专业的营养咨询或医疗建议。如有特殊饮食需求或健康问题，请咨询专业营养师或医生。

---

**© 2025 Lucas. All rights reserved.**

Made with ❤️ by Lucas
