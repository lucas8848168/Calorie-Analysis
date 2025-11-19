# 🍽️ 食物卡路里分析器

基于方舟豆包1.6大模型的智能食物识别和营养分析系统。上传食物图片，AI自动识别食物类型并计算卡路里和营养成分。

## ✨ 功能特性

- 📸 **智能图片识别** - 上传食物图片，AI自动识别食物类型
- 🔢 **卡路里计算** - 自动计算食物的卡路里含量
- 📊 **营养成分分析** - 显示蛋白质、脂肪、碳水化合物、膳食纤维等详细营养信息
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 💾 **历史记录** - 本地保存分析历史，方便追踪饮食情况
- 🚀 **性能优化** - 自动压缩图片，节省API token消耗

## 🛠️ 技术栈

### 前端
- React 19 + TypeScript
- Vite 构建工具
- CSS3 响应式布局

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

1. **上传图片**
   - 点击上传区域或拖拽图片
   - 支持 JPEG、PNG、WebP 格式
   - 最大文件大小 10MB

2. **查看分析结果**
   - 系统会自动识别食物并显示营养信息
   - 包括总卡路里和详细营养成分

3. **查看历史记录**
   - 点击"历史记录"标签查看过往分析
   - 点击记录可查看详情
   - 支持删除单条或清空全部记录

## 🔧 项目结构

\`\`\`
food-calorie-analyzer/
├── src/                      # 前端源代码
│   ├── components/          # React组件
│   ├── services/            # 服务层（API、存储）
│   ├── types/               # TypeScript类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── workers/                  # Cloudflare Workers
│   ├── src/
│   │   ├── worker.ts        # Workers主文件
│   │   ├── config.ts        # 配置管理
│   │   └── doubaoClient.ts  # 方舟豆包API客户端
│   └── wrangler.toml        # Workers配置
├── .kiro/specs/             # 项目规格文档
└── package.json
\`\`\`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC

## 🙏 致谢

- 方舟豆包1.6大模型提供AI能力
- Cloudflare提供免费的Serverless平台

## ⚠️ 免责声明

本应用提供的营养数据仅供参考，基于AI模型估算，实际值可能有所不同。如需精确的营养信息，请咨询专业营养师。
