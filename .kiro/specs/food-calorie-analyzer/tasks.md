# 实施计划

- [x] 1. 初始化项目结构和配置
  - 使用Vite创建React + TypeScript项目
  - 配置Vitest测试框架
  - 安装fast-check属性测试库
  - 配置ESLint和Prettier
  - 创建基础目录结构（components、utils、types、services）
  - _Requirements: 10.2, 10.4_

- [x] 2. 实现核心类型定义
  - 创建TypeScript接口文件（types/index.ts）
  - 定义FoodItem、NutritionInfo、AnalysisResult等数据模型
  - 定义ProcessedImage、ImageMetadata等图片相关类型
  - 定义API请求和响应类型
  - _Requirements: 1.1, 2.2, 3.1, 4.1-4.5_

- [x] 3. 实现图片处理模块
- [x] 3.1 创建图片验证和检测功能
  - 实现文件格式验证函数（validateFileFormat）
  - 实现文件大小检查函数
  - 实现图片分辨率检测函数
  - 实现图片元数据提取
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 3.2 编写属性测试 - 文件格式验证
  - **Property 1: 文件格式验证正确性**
  - **Validates: Requirements 1.1**

- [ ]* 3.3 编写属性测试 - 分辨率检测
  - **Property 2: 图片分辨率检测准确性**
  - **Validates: Requirements 1.3**

- [x] 3.4 实现图片压缩功能
  - 使用Canvas API实现图片压缩
  - 实现渐进式质量调整算法
  - 处理超过2048x2048的图片
  - 处理超过2MB的文件
  - 生成Base64编码的压缩图片
  - _Requirements: 1.4, 1.5, 1.6_

- [ ]* 3.5 编写属性测试 - 高分辨率压缩
  - **Property 3: 高分辨率图片压缩**
  - **Validates: Requirements 1.4**

- [ ]* 3.6 编写属性测试 - 大文件压缩
  - **Property 4: 大文件压缩**
  - **Validates: Requirements 1.5**

- [ ]* 3.7 编写属性测试 - 预览可用性
  - **Property 5: 压缩后预览可用性**
  - **Validates: Requirements 1.6**

- [ ]* 3.8 编写单元测试 - 图片处理边界情况
  - 测试空文件处理
  - 测试损坏图片处理
  - 测试10MB边界情况
  - _Requirements: 1.2, 1.8_

- [x] 4. 实现本地存储管理模块
- [x] 4.1 创建LocalStorage服务
  - 实现saveRecord函数
  - 实现getRecords函数
  - 实现deleteRecord函数
  - 实现clearAll函数
  - 添加错误处理（存储已满、被禁用）
  - _Requirements: 6.1, 6.2, 6.5_

- [ ]* 4.2 编写属性测试 - 存储往返一致性
  - **Property 13: 历史记录存储往返一致性**
  - **Validates: Requirements 6.1**

- [ ]* 4.3 编写属性测试 - 删除一致性
  - **Property 15: 历史记录删除一致性**
  - **Validates: Requirements 6.5**

- [ ]* 4.4 编写单元测试 - 存储错误处理
  - 测试LocalStorage已满场景
  - 测试LocalStorage被禁用场景
  - _Requirements: 6.1_

- [x] 5. 实现数据解析和计算工具
- [x] 5.1 创建API响应解析函数
  - 实现parseAnalysisResponse函数
  - 提取食物名称和营养数据
  - 处理空结果和错误响应
  - 验证数据完整性
  - _Requirements: 2.2, 2.3, 2.4, 4.1-4.5_

- [ ]* 5.2 编写属性测试 - API响应解析
  - **Property 6: API响应解析完整性**
  - **Validates: Requirements 2.2**

- [ ]* 5.3 编写属性测试 - 多食物列表
  - **Property 7: 多食物列表完整性**
  - **Validates: Requirements 2.3**

- [ ]* 5.4 编写属性测试 - 营养数据完整性
  - **Property 11: 营养成分数据完整性**
  - **Property 12: 营养成分结构化格式**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 5.5 实现卡路里计算函数
  - 实现calculateTotalCalories函数
  - 验证单个食物卡路里数据
  - 计算多食物总和
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 5.6 编写属性测试 - 卡路里计算
  - **Property 8: 卡路里数据存在性**
  - **Property 10: 卡路里总和正确性**
  - **Validates: Requirements 3.1, 3.3**

- [ ]* 5.7 编写属性测试 - 卡路里单位
  - **Property 9: 卡路里单位一致性**
  - **Validates: Requirements 3.2**

- [ ]* 5.8 编写单元测试 - 边界情况
  - 测试空食物列表
  - 测试无卡路里数据的处理
  - 测试范围值显示
  - _Requirements: 2.4, 3.4_

- [x] 6. 实现Cloudflare Workers后端API
- [x] 6.1 创建Workers项目结构
  - 初始化Cloudflare Workers项目
  - 配置wrangler.toml
  - 设置环境变量配置
  - 创建API路由处理器
  - _Requirements: 7.1, 7.2, 10.3_

- [x] 6.2 实现API密钥管理和验证
  - 从环境变量读取API密钥
  - 实现启动时密钥验证
  - 添加密钥格式检查
  - 实现错误日志记录
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 6.3 实现方舟豆包API集成
  - 创建API客户端服务
  - 实现图片分析请求
  - 构建Prompt模板
  - 处理API响应
  - 实现指数退避重试逻辑
  - _Requirements: 2.1, 8.1, 8.2_

- [ ]* 6.4 编写属性测试 - 图片压缩验证
  - **Property 16: API请求图片压缩验证**
  - **Validates: Requirements 8.2**

- [x] 6.5 实现请求验证和错误处理
  - 验证请求格式和大小
  - 实现速率限制
  - 处理API调用失败
  - 实现临时文件清理
  - 返回统一错误格式
  - _Requirements: 2.5, 8.3, 8.4, 8.5_

- [ ]* 6.6 编写属性测试 - 临时文件清理
  - **Property 17: 临时文件清理**
  - **Validates: Requirements 8.3**

- [ ]* 6.7 编写单元测试 - API错误处理
  - 测试API密钥缺失场景
  - 测试API调用超时
  - 测试限流处理
  - 测试错误响应格式
  - _Requirements: 2.5, 7.3, 8.4_

- [x] 7. 实现前端UI组件
- [x] 7.1 创建ImageUploader组件
  - 实现文件选择界面
  - 集成图片验证和压缩逻辑
  - 显示图片预览
  - 显示处理进度
  - 实现错误提示
  - _Requirements: 1.1-1.8, 5.1, 5.2_

- [x] 7.2 创建LoadingIndicator组件
  - 实现加载动画
  - 显示处理状态消息
  - 在3秒内响应
  - _Requirements: 5.1, 5.2_

- [x] 7.3 创建AnalysisDisplay组件
  - 显示食物识别结果
  - 显示卡路里信息（带单位）
  - 显示营养成分表格
  - 显示置信度和说明
  - 添加"重新分析"和"上传新图片"按钮
  - 处理空结果和错误状态
  - _Requirements: 2.2, 2.3, 2.4, 3.1-3.5, 4.1-4.5, 5.3, 5.4_

- [ ]* 7.4 编写属性测试 - 结果过滤
  - **Property 18: 结果过滤正确性**
  - **Validates: Requirements 9.4**

- [x] 7.5 创建HistoryList组件
  - 显示历史记录列表
  - 显示缩略图、食物名称、卡路里、时间
  - 实现点击查看详情
  - 实现删除功能
  - 处理空历史状态
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ]* 7.6 编写属性测试 - 历史记录显示
  - **Property 14: 历史记录显示完整性**
  - **Validates: Requirements 6.3**

- [x] 7.6 实现响应式布局
  - 使用CSS媒体查询
  - 优化移动端触摸交互
  - 测试不同屏幕尺寸
  - _Requirements: 5.5_

- [ ]* 7.7 编写单元测试 - UI组件
  - 测试组件渲染
  - 测试用户交互
  - 测试错误状态显示
  - _Requirements: 5.4, 6.4_

- [x] 8. 集成前后端并实现主应用
- [x] 8.1 创建API服务客户端
  - 实现fetch封装
  - 处理请求和响应
  - 实现超时控制
  - 处理网络错误
  - _Requirements: 2.1, 2.5, 8.1, 8.5_

- [x] 8.2 创建主App组件
  - 组合所有子组件
  - 实现状态管理
  - 处理组件间通信
  - 实现完整的用户流程
  - _Requirements: 1.1-1.8, 2.1-2.5, 3.1-3.5, 4.1-4.5, 5.1-5.5, 6.1-6.5_

- [x] 8.3 添加全局错误边界
  - 捕获未处理的错误
  - 显示友好的错误页面
  - 提供恢复选项
  - _Requirements: 2.5_

- [ ]* 8.4 编写集成测试
  - 使用MSW模拟API
  - 测试完整上传分析流程
  - 测试历史记录流程
  - 测试错误恢复
  - _Requirements: 1.7, 2.1, 6.1_

- [x] 9. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

- [x] 10. 优化性能和用户体验
- [x] 10.1 实现性能优化
  - 添加请求去重逻辑
  - 实现图片缓存
  - 优化存储容量管理（限制50条，清理30天前记录）
  - 添加代码分割
  - _Requirements: 1.4, 1.5, 8.2_

- [x] 10.2 添加用户体验增强
  - 实现图片质量检测提示
  - 添加改善建议
  - 优化加载状态显示
  - 添加估算值免责声明
  - _Requirements: 3.5, 9.1, 9.5_

- [x] 11. 配置部署
- [x] 11.1 配置Cloudflare Pages
  - 创建wrangler.toml配置
  - 配置构建命令和输出目录
  - 设置环境变量
  - 配置HTTPS和CSP策略
  - _Requirements: 7.1, 8.5, 10.1, 10.2, 10.3, 10.5_

- [x] 11.2 创建部署文档
  - 编写README.md
  - 说明环境变量配置
  - 提供部署步骤
  - 添加使用说明
  - _Requirements: 10.4_

- [x] 11.3 配置CI/CD
  - 创建GitHub Actions工作流
  - 配置自动测试
  - 配置自动部署
  - _Requirements: 10.4_

- [x] 12. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户


---

## P1 增强功能实施计划

- [x] 13. 更新TypeScript类型定义 (P1)
  - 添加MealType、MealRecord、BoundingBox等P1相关类型
  - 添加UserGoal、FavoriteFood、MealTemplate类型
  - 添加ReminderSettings、ChartDataPoint类型
  - 更新FoodItem接口添加boundingBox字段
  - _Requirements: 11.1-11.10, 12.1-12.15, 13.1-13.15, 14.1-14.15_

- [x] 14. 实现多食物识别功能
- [x] 14.1 创建ImageAnnotator组件
  - 实现图片显示和选择框绘制
  - 支持鼠标拖拽创建选择框
  - 支持多个选择框管理
  - 支持选择框调整和删除
  - 返回选择框坐标数组
  - _Requirements: 11.1, 11.2, 11.3_

- [ ]* 14.2 编写属性测试 - 选择框坐标传递
  - **Property 19: 选择框坐标传递完整性**
  - **Validates: Requirements 11.4**

- [x] 14.3 更新API客户端支持区域参数
  - 修改API请求接口支持boundingBox数组
  - 处理多食物识别响应
  - 添加边界框信息到结果
  - _Requirements: 11.4_

- [x] 14.4 创建MultiFoodResult组件
  - 显示多食物列表
  - 支持单个食物编辑和删除
  - 支持份量调整
  - 显示营养总计
  - _Requirements: 11.5, 11.6, 11.7, 11.8, 11.9_

- [ ]* 14.5 编写属性测试 - 多食物显示
  - **Property 20: 多食物列表显示完整性**
  - **Validates: Requirements 11.5**

- [ ]* 14.6 编写属性测试 - 边界框显示
  - **Property 21: 边界框信息显示**
  - **Validates: Requirements 11.6**

- [ ]* 14.7 编写属性测试 - 食物删除
  - **Property 22: 食物删除一致性**
  - **Validates: Requirements 11.7**

- [ ]* 14.8 编写属性测试 - 份量调整
  - **Property 23: 份量调整营养计算**
  - **Validates: Requirements 11.8**

- [ ]* 14.9 编写属性测试 - 营养总和
  - **Property 24: 多食物营养总和**
  - **Validates: Requirements 11.9**


- [-] 15. 实现餐次管理系统
- [x] 15.1 创建餐次数据服务
  - 实现mealService.ts
  - 实现CRUD操作
  - 实现日期范围查询
  - 实现餐次类型过滤
  - _Requirements: 12.1, 12.6, 12.15_

- [x] 15.2 创建MealTypeSelector组件
  - 显示四种餐次类型选项
  - 实现时间智能推荐
  - 支持手动选择
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 15.3 编写属性测试 - 时间餐次映射
  - **Property 25: 时间到餐次类型映射**
  - **Validates: Requirements 12.2, 12.3, 12.4, 12.5**

- [x] 15.4 创建MealTimeline组件
  - 实现日期选择器
  - 按餐次分组显示记录
  - 显示每日目标和进度条
  - 支持展开/折叠餐次详情
  - _Requirements: 12.6, 12.7, 12.8_

- [ ]* 15.5 编写属性测试 - 餐次分组
  - **Property 26: 餐次分组显示**
  - **Validates: Requirements 12.6**

- [ ]* 15.6 编写属性测试 - 餐次展开
  - **Property 27: 餐次展开信息完整性**
  - **Validates: Requirements 12.8**

- [x] 15.7 创建收藏管理服务
  - 实现favoriteService.ts
  - 实现添加/删除收藏
  - 实现频率统计和排序
  - 实现最近食用查询
  - _Requirements: 12.9, 12.10, 12.11, 12.12_

- [ ]* 15.8 编写属性测试 - 收藏往返
  - **Property 28: 收藏食物往返一致性**
  - **Validates: Requirements 12.9**

- [ ]* 15.9 编写属性测试 - 频率排序
  - **Property 29: 常吃食物频率排序**
  - **Validates: Requirements 12.10**

- [ ]* 15.10 编写属性测试 - 时间过滤
  - **Property 30: 最近食用时间过滤**
  - **Validates: Requirements 12.11**

- [ ]* 15.11 编写属性测试 - 频率更新
  - **Property 31: 快速添加频率更新**
  - **Validates: Requirements 12.12**

- [x] 15.12 创建QuickAddPanel组件
  - 显示常吃食物网格
  - 显示最近食用列表
  - 实现一键添加功能
  - 集成收藏管理
  - _Requirements: 12.10, 12.11, 12.12_

- [x] 15.13 创建模板管理服务
  - 实现templateService.ts
  - 实现模板CRUD操作
  - 实现模板应用功能
  - _Requirements: 12.13, 12.14_

- [ ]* 15.14 编写属性测试 - 模板往返
  - **Property 32: 模板往返一致性**
  - **Validates: Requirements 12.13**

- [ ]* 15.15 编写属性测试 - 模板应用
  - **Property 33: 模板应用完整性**
  - **Validates: Requirements 12.14**

- [x] 15.16 创建TemplateManager组件
  - 显示模板列表
  - 支持创建/编辑模板
  - 支持应用模板到餐次
  - 支持删除模板
  - _Requirements: 12.13, 12.14_

- [ ]* 15.17 编写属性测试 - 餐次删除
  - **Property 34: 餐次删除一致性**
  - **Validates: Requirements 12.15**

- [x] 15.18 更新AnalysisDisplay集成餐次保存
  - 添加"保存到餐次"功能
  - 集成MealTypeSelector
  - 保存时关联餐次信息
  - _Requirements: 12.1_


- [ ] 16. 实现数据可视化功能
- [x] 16.1 安装图表库
  - 安装recharts或chart.js
  - 配置图表库
  - 测试基本图表渲染
  - _Requirements: 13.1_

- [x] 16.2 创建图表数据服务
  - 实现chartDataService.ts
  - 实现时间范围数据聚合
  - 实现营养统计计算
  - 实现餐次分布计算
  - _Requirements: 13.14, 13.15_

- [ ]* 16.3 编写属性测试 - 时间范围过滤
  - **Property 38: 时间维度数据过滤**
  - **Validates: Requirements 13.11, 13.12, 13.13**

- [ ]* 16.4 编写属性测试 - 数据完整性
  - **Property 39: 时间范围数据完整性**
  - **Validates: Requirements 13.14**

- [ ]* 16.5 编写属性测试 - 平均计算
  - **Property 40: 平均卡路里计算准确性**
  - **Validates: Requirements 13.15**

- [x] 16.6 创建CalorieTrendChart组件
  - 实现折线图+柱状图组合
  - 显示目标线
  - 支持数据点点击
  - 添加数据标签
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ]* 16.7 编写属性测试 - 目标线显示
  - **Property 35: 目标线显示**
  - **Validates: Requirements 13.3**

- [x] 16.8 创建NutritionRadarChart组件
  - 实现雷达图
  - 显示四个营养维度
  - 显示实际值vs目标值
  - 添加图例
  - _Requirements: 13.5, 13.6, 13.7_

- [ ]* 16.9 编写属性测试 - 雷达图双值
  - **Property 36: 雷达图双值显示**
  - **Validates: Requirements 13.7**

- [x] 16.10 创建MealDistributionChart组件
  - 实现饼图
  - 显示四种餐次占比
  - 支持扇区点击
  - 添加百分比标签
  - _Requirements: 13.8, 13.9, 13.10_

- [ ]* 16.11 编写属性测试 - 分布完整性
  - **Property 37: 餐次分布完整性**
  - **Validates: Requirements 13.9**

- [x] 16.12 创建TimePeriodSelector组件
  - 支持日/周/月切换
  - 触发数据重新加载
  - 显示当前选择
  - _Requirements: 13.11, 13.12, 13.13_

- [x] 16.13 创建DataAnalysis页面
  - 集成所有图表组件
  - 实现时间维度切换
  - 添加数据摘要卡片
  - 实现响应式布局
  - _Requirements: 13.1-13.15_


- [ ] 17. 实现目标管理系统
- [x] 17.1 创建目标数据服务
  - 实现goalService.ts
  - 实现目标CRUD操作
  - 实现进度计算逻辑
  - 实现达标检查
  - _Requirements: 14.1-14.10_

- [ ]* 17.2 编写属性测试 - 目标验证
  - **Property 41: 目标验证**
  - **Validates: Requirements 14.5**

- [ ]* 17.3 编写属性测试 - 进度计算
  - **Property 42: 进度百分比计算**
  - **Validates: Requirements 14.6**

- [ ]* 17.4 编写属性测试 - 连续达标
  - **Property 43: 连续达标徽章显示**
  - **Validates: Requirements 14.9**

- [x] 17.5 创建GoalSetup组件
  - 实现目标类型选择
  - 实现体重目标输入
  - 实现营养目标输入
  - 实现日期选择
  - 添加表单验证
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 17.6 创建GoalProgress组件
  - 显示进度百分比
  - 显示已坚持天数
  - 显示预计剩余天数
  - 添加进度条动画
  - _Requirements: 14.6, 14.7, 14.8_

- [x] 17.7 创建GoalCard组件
  - 显示目标概览
  - 显示每日达成情况
  - 显示营养素对比
  - 显示连续达标徽章
  - 添加编辑/暂停按钮
  - _Requirements: 14.9, 14.10_

- [x] 17.8 创建提醒服务
  - 实现reminderService.ts
  - 请求通知权限
  - 实现定时提醒调度
  - 发送浏览器通知
  - 处理通知点击事件
  - _Requirements: 14.11, 14.12, 14.13, 14.14, 14.15_

- [ ]* 17.9 编写属性测试 - 权限请求
  - **Property 44: 提醒权限请求**
  - **Validates: Requirements 14.14**

- [ ]* 17.10 编写属性测试 - 通知导航
  - **Property 45: 通知点击导航**
  - **Validates: Requirements 14.15**

- [x] 17.11 创建ReminderSettings组件
  - 实现用餐提醒设置
  - 实现饮水提醒设置
  - 实现记录提醒设置
  - 保存提醒配置
  - _Requirements: 14.11, 14.12, 14.13_

- [x] 17.12 创建GoalManagement页面
  - 集成所有目标组件
  - 实现页面布局
  - 添加导航
  - _Requirements: 14.1-14.15_


- [ ] 18. P1集成与优化
- [ ] 18.1 更新主应用路由
  - 添加餐次管理路由
  - 添加数据分析路由
  - 添加目标管理路由
  - 更新导航菜单
  - 添加底部导航栏
  - _Requirements: 所有P1需求_

- [ ] 18.2 创建自定义Hooks
  - 创建useMealRecords.ts
  - 创建useGoalProgress.ts
  - 创建useChartData.ts
  - 创建useFavorites.ts
  - 优化数据获取逻辑
  - _Requirements: 所有P1需求_

- [ ] 18.3 性能优化
  - 添加React.memo优化组件
  - 使用useMemo缓存计算
  - 使用useCallback优化回调
  - 实现图表数据采样
  - 优化存储查询
  - _Requirements: 所有P1需求_

- [ ] 18.4 存储优化
  - 实现数据分片存储
  - 添加日期索引
  - 实现自动清理策略
  - 添加存储容量监控
  - _Requirements: 所有P1需求_

- [ ]* 18.5 编写集成测试
  - 测试多食物识别流程
  - 测试餐次管理流程
  - 测试图表数据流
  - 测试目标追踪流程
  - _Requirements: 所有P1需求_

- [ ] 19. P1检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

- [ ] 20. P1最终验收
- [ ] 20.1 功能验收测试
  - 测试多食物识别所有功能
  - 测试餐次管理所有功能
  - 测试数据可视化所有功能
  - 测试目标管理所有功能
  - _Requirements: 所有P1需求_

- [ ] 20.2 用户体验优化
  - 优化加载状态
  - 优化错误提示
  - 优化交互反馈
  - 优化移动端体验
  - _Requirements: 所有P1需求_

- [ ] 20.3 文档更新
  - 更新README.md
  - 添加P1功能说明
  - 更新使用指南
  - 添加截图和演示
  - _Requirements: 所有P1需求_

