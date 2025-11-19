# 🚀 快速启动指南

## 最快速度运行项目

### 1. 安装依赖（2分钟）

\`\`\`bash
# 安装前端依赖
npm install

# 安装Workers依赖
cd workers && npm install && cd ..
\`\`\`

### 2. 配置API密钥（1分钟）

获取方舟豆包API密钥后，在 \`workers\` 目录下运行：

\`\`\`bash
cd workers
npx wrangler secret put DOUBAO_API_KEY
# 粘贴你的API密钥
cd ..
\`\`\`

### 3. 启动开发服务器（30秒）

**终端1 - 启动Workers:**
\`\`\`bash
cd workers
npm run dev
\`\`\`

**终端2 - 启动前端:**
\`\`\`bash
npm run dev
\`\`\`

### 4. 访问应用

打开浏览器访问: http://localhost:5173

## 🎯 开始使用

1. 点击上传区域或拖拽食物图片
2. 等待AI分析（约5-10秒）
3. 查看卡路里和营养成分结果
4. 在"历史记录"标签查看过往分析

## 📝 注意事项

- 确保图片清晰，食物可见
- 支持的格式：JPEG、PNG、WebP
- 最大文件大小：10MB
- 图片会自动压缩以节省API token

## 🐛 常见问题

**Q: Workers启动失败？**
A: 确保已安装 wrangler 并配置了API密钥

**Q: 前端无法连接后端？**
A: 检查 Workers 是否运行在 http://localhost:8787

**Q: API调用失败？**
A: 检查方舟豆包API密钥是否正确配置

## 📚 更多信息

查看完整文档：[README.md](./README.md)
