# 🍽️ 食物卡路里分析器

一个基于 AI 的智能食物识别和营养分析系统，帮助你轻松追踪饮食和管理健康目标。

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020.svg)](https://workers.cloudflare.com/)

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
- **平台**: Cloudflare Workers（Serverless）
- **AI**: 豆包 1.6 Vision API
- **部署**: Wrangler CLI

## 📦 快速开始

### 前提条件
- Node.js 18+
- npm 或 yarn

### 安装和运行

```bash
# 克隆仓库
git clone https://github.com/your-username/food-calorie-analyzer.git
cd food-calorie-analyzer

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

## 🌟 特色亮点

### 智能识别
- 支持中式和西式常见菜肴
- 自动估算食物重量
- 识别准确率高
- 30-60 秒快速响应

### 营养分析
- 精确的卡路里计算
- 详细的营养素分解（蛋白质、脂肪、碳水、纤维）
- 基于实际分量的数据
- 专业的健康建议

### 目标管理
- 科学的营养目标计算
- 灵活的目标调整
- 实时进度追踪
- 达标率统计

### 数据可视化
- 每日营养摄入趋势
- 营养素分布图
- 餐次分布统计
- 目标进度图表

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
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless 平台
- [豆包 AI](https://www.volcengine.com/product/doubao) - AI 识别服务

## 📞 联系方式

### 商务合作
如有商务合作、技术咨询或其他问题，欢迎联系：

- **邮箱**: lucas8848168@gmail.com
- **GitHub Issues**: [提交问题](https://github.com/lucas8848168/food-calorie-analyzer/issues)

### 技术支持
- 查看 [Issues](https://github.com/lucas8848168/food-calorie-analyzer/issues) 寻找解决方案
- 提交新的 Issue 报告问题
- 参与 Discussions 讨论

## ⚠️ 免责声明

本应用提供的营养数据和健康建议仅供参考，不能替代专业的营养咨询或医疗建议。如有特殊饮食需求或健康问题，请咨询专业营养师或医生。

## 🌟 Star History

如果这个项目对你有帮助，欢迎给个 Star ⭐️

---

**© 2025 Lucas. All rights reserved.**

Made with ❤️ by Lucas
