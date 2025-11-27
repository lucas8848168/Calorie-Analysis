# 🍽️ 食物卡路里分析器

一个基于 AI 的智能食物识别和营养分析系统，帮助你轻松追踪饮食和管理健康。

## ✨ 主要功能

- 📸 **智能识别**: 拍照即可识别食物并计算卡路里
- 📊 **营养分析**: 详细的蛋白质、脂肪、碳水化合物、纤维数据
- 🎯 **目标管理**: 设置个人健康目标，智能追踪进度
- 📈 **数据可视化**: 直观的图表展示营养摄入趋势
- 💡 **AI 建议**: 个性化的饮食建议和健康提示
- 📱 **PWA 支持**: 可安装到手机，离线也能使用
- 🔄 **历史记录**: 本地存储，保护隐私

## 🚀 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: 原生 CSS3（响应式设计）
- **图表**: Recharts
- **PWA**: Service Worker + Manifest

### 后端
- **平台**: Cloudflare Workers（Serverless）
- **AI**: 豆包 1.6 Vision API
- **部署**: Wrangler CLI

## 📦 快速开始

### 前提条件
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动前端开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本
```bash
npm run build
```

## 🎯 使用指南

### 1. 注册/登录
首次使用需要创建账号，数据存储在本地浏览器中。

### 2. 设置个人信息
填写身高、体重、年龄等信息，系统会计算你的基础代谢率。

### 3. 创建健康目标
选择目标类型（减重/增重/维持），设置目标值和时间。

### 4. 拍照识别食物
- 点击上传按钮或拍照
- AI 自动识别食物并计算营养
- 查看详细的营养分析和健康建议

### 5. 追踪进度
在数据分析页面查看：
- 每日营养摄入趋势
- 目标完成进度
- 营养素分布

## 🔧 配置说明

### 环境变量
创建 `.env` 文件：
```bash
# API 端点
VITE_API_ENDPOINT=https://your-api-endpoint.workers.dev

# 管理员配置（可选）
VITE_ADMIN_DEVICES=admin
VITE_ADMIN_PASSWORD=your_password
```

## 📱 PWA 安装

### iOS
1. 在 Safari 中打开应用
2. 点击分享按钮
3. 选择"添加到主屏幕"

### Android
1. 在 Chrome 中打开应用
2. 点击菜单
3. 选择"安装应用"

## 🌟 特色功能

### 智能识别
- 支持多种食物同时识别
- 自动估算食物重量
- 识别常见中式和西式菜肴

### 营养分析
- 精确的卡路里计算
- 详细的营养素分解
- 基于实际分量的数据

### 健康建议
- 个性化饮食建议
- 适合/不适合人群提示
- 营养搭配建议

### 数据可视化
- 每日营养摄入趋势图
- 营养素分布饼图
- 目标进度追踪

## 🔒 隐私保护

- ✅ 所有用户数据存储在本地浏览器
- ✅ 不上传个人信息到服务器
- ✅ 仅上传食物图片用于识别
- ✅ 图片不会被保存

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 ISC 许可证。

## 🙏 致谢

- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Recharts](https://recharts.org/) - 图表库
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless 平台
- [豆包 AI](https://www.volcengine.com/product/doubao) - AI 识别服务

## 📞 联系方式

如有问题或建议，欢迎：
- 提交 Issue
- 发送邮件
- 加入讨论

---

**注意**: 本应用提供的营养数据仅供参考，不能替代专业的营养咨询。如有特殊饮食需求，请咨询专业营养师或医生。
