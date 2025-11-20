# P1 级优化 - 详细设计文档

**项目**: 食物卡路里分析器  
**版本**: P1 Optimization v1.0  
**创建日期**: 2025-11-20  
**设计师**: Senior Architect (20年经验)  
**状态**: 📋 待实施

---

## 📋 目录

1. [总体架构](#总体架构)
2. [功能模块设计](#功能模块设计)
3. [数据模型设计](#数据模型设计)
4. [技术实现方案](#技术实现方案)
5. [UI/UX 设计规范](#uiux-设计规范)

---

## 总体架构

### 架构升级概览

```
当前架构:
┌─────────────────────────────────────┐
│  单次分析 → 显示结果 → 保存历史    │
└─────────────────────────────────────┘

P1 升级架构:
┌─────────────────────────────────────────────────────┐
│  多食物识别 → 餐次管理 → 数据可视化 → 目标追踪    │
│     ↓            ↓           ↓            ↓         │
│  区域选择    时间轴展示   图表分析    进度监控     │
└─────────────────────────────────────────────────────┘
```

### 核心改进点

1. **从单一到多元**: 支持多食物识别和管理
2. **从记录到管理**: 引入餐次概念和时间维度
3. **从数据到洞察**: 提供趋势分析和可视化
4. **从使用到坚持**: 目标系统提升用户粘性

---

## 功能模块设计

### 模块 1: 多食物识别增强

#### 1.1 功能概述
- 支持图片中多个食物的识别
- 用户可手动框选特定区域
- 分别显示每个食物的营养信息

#### 1.2 用户流程

```
用户上传图片
    ↓
显示图片预览
    ↓
[选项A] 自动识别全部食物
[选项B] 手动框选特定区域
    ↓
显示识别结果列表
    ↓
用户可编辑/删除单个食物
    ↓
确认并保存到餐次
```

#### 1.3 技术要点
- 前端图片标注组件
- 区域坐标计算和传递
- 多食物结果的聚合显示
- 可编辑的食物列表

---

### 模块 2: 餐次管理系统

#### 2.1 功能概述
- 按餐次（早/午/晚/加餐）组织饮食记录
- 时间轴方式展示每日饮食
- 快速添加常吃食物
- 饮食模板功能

#### 2.2 餐次类型定义
- 🌅 **早餐** (Breakfast): 5:00-10:00
- 🌞 **午餐** (Lunch): 11:00-14:00
- 🌙 **晚餐** (Dinner): 17:00-21:00
- 🍎 **加餐** (Snack): 其他时间

#### 2.3 核心功能
1. **餐次记录**
   - 自动根据时间判断餐次
   - 手动选择餐次类型
   - 每餐可包含多个食物

2. **快速添加**
   - 常吃食物收藏列表
   - 最近食用历史
   - 一键添加到当前餐次

3. **饮食模板**
   - 创建自定义模板
   - 保存常用组合
   - 快速应用模板

---

### 模块 3: 数据可视化

#### 3.1 功能概述
- 卡路里趋势图表
- 营养均衡雷达图
- 多时间维度切换
- 数据对比分析

#### 3.2 图表类型

**3.2.1 卡路里趋势图**
- 类型: 折线图 + 柱状图组合
- 数据: 每日总卡路里
- 功能: 显示目标线、点击查看详情

**3.2.2 营养雷达图**
- 类型: 雷达图
- 维度: 蛋白质、碳水、脂肪、纤维
- 功能: 显示实际值 vs 目标值

**3.2.3 餐次分布图**
- 类型: 饼图
- 数据: 各餐次卡路里占比
- 功能: 点击查看餐次详情

#### 3.3 时间维度
- 📅 **日视图**: 显示每餐详情
- 📊 **周视图**: 显示7天趋势
- 📈 **月视图**: 显示30天趋势

---

### 模块 4: 目标管理系统

#### 4.1 功能概述
- 设定个人健康目标
- 追踪目标进度
- 智能提醒功能
- 成就激励

#### 4.2 目标类型

**4.2.1 减重目标**
- 目标体重
- 每日卡路里限额
- 预计达成时间

**4.2.2 增肌目标**
- 目标体重/肌肉量
- 高蛋白质摄入
- 每日卡路里需求

**4.2.3 健康目标**
- 营养均衡
- 控制特定营养素
- 养成健康习惯

#### 4.3 提醒系统
- ⏰ 用餐时间提醒
- 💧 饮水提醒（每2小时）
- 📊 记录提醒
- 🎯 目标进度提醒

---

## 数据模型设计

### 核心数据结构

#### 1. 餐次记录 (MealRecord)
```typescript
interface MealRecord {
  id: string;                    // 唯一标识
  userId: string;                // 用户ID
  mealType: MealType;            // 餐次类型
  mealTime: Date;                // 用餐时间
  foods: FoodItem[];             // 食物列表
  totalNutrition: NutritionInfo; // 总营养信息
  notes?: string;                // 备注
  photos?: string[];             // 照片
  createdAt: Date;
  updatedAt: Date;
}

enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack'
}
```

#### 2. 食物项 (FoodItem)
```typescript
interface FoodItem {
  id: string;
  name: string;
  portion: number;               // 份量（克）
  calories: number;
  nutrition: NutritionInfo;
  imageUrl?: string;
  boundingBox?: BoundingBox;     // 图片中的位置
  confidence?: number;           // 识别置信度
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

#### 3. 用户目标 (UserGoal)
```typescript
interface UserGoal {
  id: string;
  userId: string;
  type: GoalType;
  startDate: Date;
  targetDate: Date;
  
  // 体重相关
  currentWeight?: number;
  targetWeight?: number;
  
  // 每日目标
  dailyCalorieGoal: number;
  macroGoals: {
    protein: number;    // 克
    carbs: number;
    fat: number;
    fiber: number;
  };
  
  // 进度
  progress: number;     // 0-100
  status: 'active' | 'completed' | 'paused';
}

enum GoalType {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  MAINTAIN = 'maintain',
  HEALTH = 'health'
}
```

#### 4. 收藏食物 (FavoriteFood)
```typescript
interface FavoriteFood {
  id: string;
  userId: string;
  foodItem: FoodItem;
  frequency: number;      // 食用频率
  lastUsed: Date;
  tags: string[];         // 标签：早餐、快手、健康等
  createdAt: Date;
}
```

#### 5. 饮食模板 (MealTemplate)
```typescript
interface MealTemplate {
  id: string;
  userId: string;
  name: string;           // "工作日早餐"
  mealType: MealType;
  foods: FoodItem[];
  totalCalories: number;
  totalNutrition: NutritionInfo;
  usageCount: number;
  createdAt: Date;
}
```

#### 6. 提醒设置 (ReminderSettings)
```typescript
interface ReminderSettings {
  userId: string;
  enabled: boolean;
  
  mealReminders: {
    breakfast: { enabled: boolean; time: string; }; // "07:30"
    lunch: { enabled: boolean; time: string; };
    dinner: { enabled: boolean; time: string; };
  };
  
  waterReminder: {
    enabled: boolean;
    interval: number;     // 分钟
    startTime: string;    // "08:00"
    endTime: string;      // "22:00"
  };
  
  recordReminder: {
    enabled: boolean;
    time: string;         // "21:00"
  };
}
```

---

## 技术实现方案

### 前端架构

#### 1. 新增组件结构
```
src/
├── components/
│   ├── ImageAnnotator/          # 图片标注组件
│   │   ├── ImageAnnotator.tsx
│   │   ├── ImageAnnotator.css
│   │   └── SelectionBox.tsx
│   │
│   ├── MealManager/             # 餐次管理
│   │   ├── MealTimeline.tsx     # 时间轴视图
│   │   ├── MealCard.tsx         # 餐次卡片
│   │   ├── MealTypeSelector.tsx # 餐次选择器
│   │   └── MealManager.css
│   │
│   ├── QuickAdd/                # 快速添加
│   │   ├── QuickAddPanel.tsx
│   │   ├── FavoriteFoods.tsx    # 常吃食物
│   │   ├── RecentFoods.tsx      # 最近食物
│   │   └── QuickAdd.css
│   │
│   ├── Charts/                  # 图表组件
│   │   ├── CalorieTrendChart.tsx
│   │   ├── NutritionRadarChart.tsx
│   │   ├── MealDistributionChart.tsx
│   │   ├── TimePeriodSelector.tsx
│   │   └── Charts.css
│   │
│   ├── GoalManager/             # 目标管理
│   │   ├── GoalSetup.tsx        # 目标设置
│   │   ├── GoalProgress.tsx     # 进度显示
│   │   ├── GoalCard.tsx
│   │   └── GoalManager.css
│   │
│   └── TemplateManager/         # 模板管理
│       ├── TemplateList.tsx
│       ├── TemplateEditor.tsx
│       └── TemplateManager.css
│
├── services/
│   ├── mealService.ts           # 餐次服务
│   ├── goalService.ts           # 目标服务
│   ├── favoriteService.ts       # 收藏服务
│   ├── templateService.ts       # 模板服务
│   ├── chartDataService.ts      # 图表数据服务
│   └── reminderService.ts       # 提醒服务
│
└── hooks/
    ├── useMealRecords.ts        # 餐次记录 Hook
    ├── useGoalProgress.ts       # 目标进度 Hook
    ├── useChartData.ts          # 图表数据 Hook
    └── useFavorites.ts          # 收藏 Hook
```

#### 2. 状态管理策略
```typescript
// 使用 Context + Hooks 管理全局状态

// MealContext - 餐次数据
interface MealContextType {
  meals: MealRecord[];
  addMeal: (meal: MealRecord) => void;
  updateMeal: (id: string, meal: Partial<MealRecord>) => void;
  deleteMeal: (id: string) => void;
  getMealsByDate: (date: Date) => MealRecord[];
  getMealsByDateRange: (start: Date, end: Date) => MealRecord[];
}

// GoalContext - 目标数据
interface GoalContextType {
  goals: UserGoal[];
  activeGoal: UserGoal | null;
  setGoal: (goal: UserGoal) => void;
  updateGoalProgress: () => void;
  checkGoalAchievement: () => void;
}

// FavoriteContext - 收藏数据
interface FavoriteContextType {
  favorites: FavoriteFood[];
  addFavorite: (food: FoodItem) => void;
  removeFavorite: (id: string) => void;
  getFavoritesByTag: (tag: string) => FavoriteFood[];
  updateFrequency: (id: string) => void;
}
```

#### 3. 数据持久化
```typescript
// LocalStorage 结构
{
  "meals": MealRecord[],           // 餐次记录
  "goals": UserGoal[],             // 目标
  "favorites": FavoriteFood[],     // 收藏
  "templates": MealTemplate[],     // 模板
  "reminders": ReminderSettings,   // 提醒设置
  "userProfile": UserProfile       // 用户资料
}

// IndexedDB 用于大量历史数据
Database: food-analyzer
  - ObjectStore: meals (keyPath: id, index: mealTime)
  - ObjectStore: goals (keyPath: id)
  - ObjectStore: favorites (keyPath: id)
  - ObjectStore: templates (keyPath: id)
```

---

## UI/UX 设计规范

### 1. 多食物识别界面

#### 布局设计
```
┌─────────────────────────────────────┐
│  ← 返回        多食物识别           │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────┐     │
│  │                           │     │
│  │    [上传的图片预览]       │     │
│  │                           │     │
│  │  ┌─────────┐              │     │
│  │  │ 食物1   │              │     │
│  │  └─────────┘              │     │
│  │                           │     │
│  └───────────────────────────┘     │
│                                     │
│  💡 提示: 点击拖拽框选食物区域      │
│                                     │
│  [分析选中区域] [分析全部食物]     │
│                                     │
├─────────────────────────────────────┤
│  识别结果 (3个食物)                 │
│                                     │
│  ✓ 米饭 - 200 kcal                 │
│  ✓ 鸡肉 - 180 kcal                 │
│  ✓ 西兰花 - 45 kcal                │
│                                     │
│  总计: 425 kcal                     │
│                                     │
│  [保存到餐次]                       │
└─────────────────────────────────────┘
```

### 2. 餐次管理界面

#### 时间轴视图
```
┌─────────────────────────────────────┐
│  📅 2025年11月20日  [< 今天 >]     │
├─────────────────────────────────────┤
│  目标: 1800 kcal                    │
│  已摄入: 1226 kcal (68%)            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░               │
│  剩余: 574 kcal                     │
├─────────────────────────────────────┤
│                                     │
│  🌅 早餐 · 7:30                     │
│  ┌─────────────────────────────┐   │
│  │ 🥚 水煮蛋 x2      156 kcal  │   │
│  │ 🥛 牛奶          120 kcal  │   │
│  │ 🍞 全麦面包       180 kcal  │   │
│  └─────────────────────────────┘   │
│  小计: 456 kcal                     │
│                                     │
│  🌞 午餐 · 12:15                    │
│  ┌─────────────────────────────┐   │
│  │ 🍚 米饭          200 kcal  │   │
│  │ 🍗 鸡胸肉        180 kcal  │   │
│  │ 🥦 西兰花         45 kcal  │   │
│  └─────────────────────────────┘   │
│  小计: 425 kcal                     │
│                                     │
│  🌙 晚餐 · 待添加                   │
│  [+ 添加晚餐]                       │
│                                     │
│  🍎 加餐 (1次)                      │
│  ┌─────────────────────────────┐   │
│  │ 🍎 苹果          95 kcal   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3. 快速添加面板

```
┌─────────────────────────────────────┐
│  快速添加到 [午餐 ▼]                │
├─────────────────────────────────────┤
│  ⭐ 常吃食物                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │🥚  │ │🥛  │ │🍚  │ │🍗  │      │
│  │鸡蛋│ │牛奶│ │米饭│ │鸡肉│      │
│  └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  🕐 最近食用                        │
│  • 西兰花 (昨天午餐)                │
│  • 苹果 (今天上午)                  │
│  • 酸奶 (昨天晚餐)                  │
│                                     │
│  📋 我的模板                        │
│  • 工作日早餐 (456 kcal)            │
│  • 健身后加餐 (280 kcal)            │
│                                     │
│  [📷 拍照识别] [✏️ 手动输入]       │
└─────────────────────────────────────┘
```

### 4. 数据图表界面

```
┌─────────────────────────────────────┐
│  📊 数据分析                        │
│  [日] [周] [月]  ← 时间切换         │
├─────────────────────────────────────┤
│  卡路里趋势 (本周)                  │
│  ┌─────────────────────────────┐   │
│  │ 2000┤                       │   │
│  │     │   ●─●                 │   │
│  │ 1500┤ ●─●   ●─●─●           │   │
│  │     │                       │   │
│  │ 1000┤                       │   │
│  │     └─────────────────────  │   │
│  │      一 二 三 四 五 六 日   │   │
│  └─────────────────────────────┘   │
│  平均: 1650 kcal/天                 │
│  目标: 1800 kcal/天                 │
│                                     │
│  营养均衡                           │
│  ┌─────────────────────────────┐   │
│  │        蛋白质                │   │
│  │          /\                  │   │
│  │         /  \                 │   │
│  │    脂肪 ──── 碳水            │   │
│  │         \  /                 │   │
│  │          \/                  │   │
│  │        纤维                  │   │
│  └─────────────────────────────┘   │
│  均衡度: 85/100 ⭐⭐⭐⭐            │
│                                     │
│  餐次分布                           │
│  🌅 早餐: 25% (456 kcal)            │
│  🌞 午餐: 35% (630 kcal)            │
│  🌙 晚餐: 30% (540 kcal)            │
│  🍎 加餐: 10% (180 kcal)            │
│                                     │
└─────────────────────────────────────┘
```

### 5. 目标管理界面

```
┌─────────────────────────────────────┐
│  🎯 我的目标                        │
├─────────────────────────────────────┤
│  当前目标: 减重计划                 │
│  [编辑] [暂停]                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  起始: 70 kg                │   │
│  │  目标: 65 kg                │   │
│  │  当前: 68 kg                │   │
│  │                             │   │
│  │  进度: ▓▓▓▓▓▓░░░░ 40%      │   │
│  │                             │   │
│  │  已坚持: 20 天              │   │
│  │  预计还需: 30 天            │   │
│  └─────────────────────────────┘   │
│                                     │
│  每日目标                           │
│  • 卡路里: 1800 kcal                │
│  • 蛋白质: 90g                      │
│  • 碳水化合物: 200g                 │
│  • 脂肪: 60g                        │
│                                     │
│  本周表现                           │
│  ✅ 达标 5 天                       │
│  ⚠️ 超标 1 天                       │
│  ⭐ 连续达标 3 天                   │
│                                     │
│  💡 AI 建议                         │
│  "您的蛋白质摄入略低，建议增加    │
│   瘦肉、鱼类或豆制品的摄入"        │
│                                     │
└─────────────────────────────────────┘
```

### 6. 提醒设置界面

```
┌─────────────────────────────────────┐
│  ⏰ 提醒设置                        │
├─────────────────────────────────────┤
│  用餐提醒                           │
│  ┌─────────────────────────────┐   │
│  │ 🌅 早餐  [●] 07:30  [编辑] │   │
│  │ 🌞 午餐  [●] 12:00  [编辑] │   │
│  │ 🌙 晚餐  [●] 18:30  [编辑] │   │
│  └─────────────────────────────┘   │
│                                     │
│  饮水提醒                           │
│  ┌─────────────────────────────┐   │
│  │ 💧 开启  [●]                │   │
│  │ 间隔: 每 2 小时              │   │
│  │ 时段: 08:00 - 22:00         │   │
│  └─────────────────────────────┘   │
│                                     │
│  记录提醒                           │
│  ┌─────────────────────────────┐   │
│  │ 📊 每日记录  [●] 21:00      │   │
│  │ "别忘了记录今天的饮食哦~"   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [保存设置]                         │
└─────────────────────────────────────┘
```

---

## 交互设计细节

### 1. 图片标注交互
- 鼠标按下开始绘制选择框
- 拖拽调整选择框大小
- 双击选择框确认选择
- 右键删除选择框
- 支持多个选择框

### 2. 餐次卡片交互
- 左滑显示编辑/删除按钮
- 点击展开显示详细营养信息
- 长按进入编辑模式
- 拖拽调整食物顺序

### 3. 图表交互
- 点击数据点查看详情
- 拖拽选择日期范围
- 双指缩放调整时间跨度
- 长按显示具体数值

### 4. 快速添加交互
- 点击常吃食物直接添加
- 长按编辑份量
- 左滑移除收藏
- 下拉刷新最近食用

---

## 性能优化考虑

### 1. 数据加载优化
- 懒加载历史数据
- 虚拟滚动长列表
- 图表数据分页加载
- 缓存常用数据

### 2. 渲染优化
- React.memo 优化组件
- useMemo 缓存计算结果
- useCallback 优化回调
- 防抖节流处理输入

### 3. 存储优化
- 定期清理过期数据
- 压缩存储大对象
- 分离热数据和冷数据
- 增量同步策略

---

**文档版本**: 1.0  
**最后更新**: 2025-11-20  
**状态**: ✅ 设计完成，待实施
