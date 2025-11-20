# 🍽️ 食物卡路里分析器

基于方舟豆包1.6大模型的智能食物识别和营养分析系统。上传食物图片，AI自动识别食物类型并计算卡路里和营养成分。

## ✨ 功能特性

### 核心功能
- 📸 **智能图片识别** - 上传食物图片，AI自动识别食物类型
- 🔢 **卡路里计算** - 自动计算食物的卡路里含量
- 📊 **营养成分分析** - 显示蛋白质、脂肪、碳水化合物、膳食纤维等详细营养信息
- 💾 **历史记录** - 本地保存分析历史，方便追踪饮食情况

### P1增强功能
- 🍽️ **餐次管理** - 按早餐、午餐、晚餐、加餐分类管理饮食记录
- 📈 **数据可视化** - 卡路里趋势图、营养雷达图、餐次分布图
- 🎯 **目标管理** - 设置健康目标，追踪进度，连续达标徽章
- ⭐ **收藏功能** - 收藏常吃食物，快速添加到餐次
- 📋 **模板管理** - 保存常用餐次组合，一键应用
- 🔔 **智能提醒** - 用餐提醒、饮水提醒、记录提醒
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 🚀 **性能优化** - 自动压缩图片，智能缓存，存储优化

## 🛠️ 技术栈

### 前端
- React 19 + TypeScript
- Vite 7 构建工具
- Recharts 图表库
- CSS3 响应式布局
- 自定义Hooks (useMealRecords, useGoalProgress, useChartData, useFavorites)

### 后端
- Cloudflare Workers (Serverless)
- 方舟豆包1.6 Vision API

### 部署
- Cloudflare Pages (前端)
- Cloudflare Workers (后端API)

## 📦 安装和运行

### 前置要求

- Node.js 18+
- npm 或 yarn
- 方舟豆包API密钥

### 1. 克隆项目

\`\`\`bash
git clone <repository-url>
cd food-calorie-analyzer
\`\`\`

### 2. 安装依赖

\`\`\`bash
# 安装前端依赖
npm install

# 安装Workers依赖
cd workers
npm install
cd ..
\`\`\`

### 3. 配置环境变量

#### 前端配置

复制 \`.env.example\` 为 \`.env\`:

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 \`.env\` 文件：

\`\`\`
VITE_API_ENDPOINT=http://localhost:8787
\`\`\`

#### Workers配置

在 \`workers\` 目录下配置API密钥：

\`\`\`bash
cd workers
npx wrangler secret put DOUBAO_API_KEY
# 输入你的方舟豆包API密钥
\`\`\`

编辑 \`workers/wrangler.toml\` 设置API端点（可选）：

\`\`\`toml
[env.production.vars]
DOUBAO_API_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3"
\`\`\`

### 4. 本地开发

#### 启动Workers开发服务器

\`\`\`bash
cd workers
npm run dev
# Workers将运行在 http://localhost:8787
\`\`\`

#### 启动前端开发服务器

在另一个终端：

\`\`\`bash
npm run dev
# 前端将运行在 http://localhost:5173
\`\`\`

访问 http://localhost:5173 即可使用应用。

### 5. 构建生产版本

\`\`\`bash
# 构建前端
npm run build

# 构建产物在 dist/ 目录
\`\`\`

## 🚀 部署到Cloudflare

### 部署Workers

\`\`\`bash
cd workers
npm run deploy
\`\`\`

部署后会得到Workers的URL，例如：\`https://food-analyzer-api.your-account.workers.dev\`

### 部署前端到Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 页面
3. 点击 "Create a project"
4. 连接你的 Git 仓库
5. 配置构建设置：
   - **构建命令**: \`npm run build\`
   - **构建输出目录**: \`dist\`
   - **环境变量**: 
     - \`VITE_API_ENDPOINT\`: 你的Workers URL

6. 点击 "Save and Deploy"

### 配置环境变量

在Cloudflare Pages项目设置中添加环境变量：

- \`VITE_API_ENDPOINT\`: Workers的完整URL

在Cloudflare Workers设置中添加密钥：

- \`DOUBAO_API_KEY\`: 方舟豆包API密钥
- \`DOUBAO_API_ENDPOINT\`: (可选) API端点URL

## 📖 使用说明

### 基础功能

1. **上传图片**
   - 点击上传区域或拖拽图片
   - 支持 JPEG、PNG、WebP 格式
   - 最大文件大小 10MB
   - AI识别通常需要30-60秒

2. **查看分析结果**
   - 系统会自动识别食物并显示营养信息
   - 包括总卡路里和详细营养成分
   - 显示健康建议和适用人群

3. **保存到餐次**
   - 点击"保存到餐次"按钮
   - 选择餐次类型（早餐/午餐/晚餐/加餐）
   - 系统会根据时间智能推荐餐次类型

### 餐次管理

4. **查看餐次记录**
   - 切换到"历史"标签
   - 按日期和餐次类型查看记录
   - 展开查看详细营养信息

5. **快速添加**
   - 使用常吃食物网格快速添加
   - 查看最近食用的食物
   - 收藏常吃的食物

6. **模板管理**
   - 保存常用的餐次组合为模板
   - 一键应用模板到新餐次
   - 编辑或删除模板

### 数据分析

7. **查看数据趋势**
   - 切换到"数据"标签
   - 选择时间维度（日/周/月）
   - 查看卡路里趋势图
   - 查看营养雷达图
   - 查看餐次分布图

8. **数据摘要**
   - 查看平均每日卡路里
   - 查看总餐次和记录天数
   - 查看营养素达成情况

### 目标管理

9. **设置目标**
   - 切换到"目标"标签
   - 选择目标类型（减重/增肌/维持/健康）
   - 设置目标体重和营养目标
   - 选择开始和结束日期

10. **追踪进度**
    - 查看进度百分比
    - 查看已坚持天数
    - 查看连续达标徽章
    - 查看每日达成情况

11. **设置提醒**
    - 设置用餐提醒时间
    - 设置饮水提醒间隔
    - 设置记录提醒时间

## 🔧 项目结构

\`\`\`
food-calorie-analyzer/
├── src/                      # 前端源代码
│   ├── components/          # React组件
│   │   ├── Charts/          # 图表组件
│   │   ├── Goal/            # 目标管理组件
│   │   ├── Meal/            # 餐次管理组件
│   │   ├── Reminder/        # 提醒组件
│   │   └── TemplateManager/ # 模板管理组件
│   ├── pages/               # 页面组件
│   │   ├── DataAnalysis.tsx # 数据分析页面
│   │   └── GoalManagement.tsx # 目标管理页面
│   ├── hooks/               # 自定义Hooks
│   │   ├── useMealRecords.ts
│   │   ├── useGoalProgress.ts
│   │   ├── useChartData.ts
│   │   └── useFavorites.ts
│   ├── services/            # 服务层
│   │   ├── apiClient.ts     # API客户端
│   │   ├── mealService.ts   # 餐次服务
│   │   ├── goalService.ts   # 目标服务
│   │   ├── favoriteService.ts # 收藏服务
│   │   ├── templateService.ts # 模板服务
│   │   ├── reminderService.ts # 提醒服务
│   │   └── chartDataService.ts # 图表数据服务
│   ├── types/               # TypeScript类型定义
│   ├── utils/               # 工具函数
│   │   └── storageOptimizer.ts # 存储优化
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── workers/                  # Cloudflare Workers
│   ├── src/
│   │   ├── worker.ts        # Workers主文件
│   │   ├── config.ts        # 配置管理
│   │   └── doubaoClient.ts  # 方舟豆包API客户端
│   └── wrangler.toml        # Workers配置
├── .kiro/specs/             # 项目规格文档
├── docs/                     # 文档
│   ├── COMMERCIAL_READINESS_ANALYSIS.md
│   ├── ARCHITECTURE_EXPLANATION.md
│   ├── CLOUDFLARE_FREE_TIER_ANALYSIS.md
│   └── P1_PHASE_COMPLETION_SUMMARY.md
└── package.json
\`\`\`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC

## 🙏 致谢

- 方舟豆包1.6大模型提供AI能力
- Cloudflare提供免费的Serverless平台

## 📊 项目状态

- **当前版本**: P1 (MVP + 增强功能)
- **开发状态**: ✅ 核心功能完成
- **部署状态**: 可部署到Cloudflare免费套餐
- **商业化准备度**: 40% (需要用户系统、数据同步等)

## 🎯 路线图

### ✅ 已完成 (P0 + P1)
- 基础食物识别和营养分析
- 餐次管理系统
- 数据可视化
- 目标管理和追踪
- 提醒功能
- 性能和存储优化

### 🚧 计划中 (P2)
- 用户账号系统
- 云端数据同步
- 支付和订阅系统
- AI营养师对话
- 社交功能
- 数据导出

详见 [商业化准备度分析](COMMERCIAL_READINESS_ANALYSIS.md)

## 💰 成本估算

### 免费部署（Cloudflare免费套餐）
- Cloudflare Pages: $0
- Cloudflare Workers: $0 (10万次/天)
- 豆包AI API: $15-50/月（主要成本）

**适用场景**: MVP阶段，<1000 DAU

详见 [Cloudflare免费部署分析](CLOUDFLARE_FREE_TIER_ANALYSIS.md)

## 📚 文档

- [项目架构说明](ARCHITECTURE_EXPLANATION.md) - 数据存储和后端角色
- [商业化准备度分析](COMMERCIAL_READINESS_ANALYSIS.md) - 商业化所需功能
- [Cloudflare免费部署分析](CLOUDFLARE_FREE_TIER_ANALYSIS.md) - 免费部署可行性
- [P1阶段完成总结](P1_PHASE_COMPLETION_SUMMARY.md) - P1功能总结
- [Task 18完成报告](TASK_18_COMPLETION_REPORT.md) - 集成与优化
- [用户体验优化建议](UX_OPTIMIZATION_RECOMMENDATIONS.md) - UX改进建议

## 🐛 已知问题

1. 属性测试未实现（标记为可选）
2. 集成测试未实现（标记为可选）
3. 部分UX优化待实施（见UX优化建议文档）

## 💡 开发建议

### 本地开发
1. 使用两个终端分别运行前端和后端
2. 前端: `npm run dev` (端口5173)
3. 后端: `cd workers && npm run dev` (端口8787)

### 调试技巧
1. 使用浏览器开发者工具查看网络请求
2. 检查LocalStorage查看存储的数据
3. Workers日志会显示在终端

### 性能优化
1. 图片上传前会自动压缩
2. 使用React.memo优化组件渲染
3. 使用useMemo缓存计算结果
4. 自动清理30天前的旧数据

## ⚠️ 免责声明

本应用提供的营养数据仅供参考，基于AI模型估算，实际值可能有所不同。如需精确的营养信息，请咨询专业营养师。

## 📞 联系方式

如有问题或建议，欢迎提交Issue或Pull Request。

---

**最后更新**: 2025-11-20  
**版本**: P1 (MVP + Enhanced Features)
