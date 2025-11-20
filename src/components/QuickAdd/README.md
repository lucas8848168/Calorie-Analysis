# QuickAdd 组件

快速添加面板组件，用于快速添加常吃食物和最近食用的食物到餐次。

## 组件结构

```
QuickAdd/
├── QuickAddPanel.tsx       # 主面板组件
├── FavoriteFoods.tsx       # 常吃食物组件
├── RecentFoods.tsx         # 最近食用组件
├── QuickAddDemo.tsx        # 演示组件
├── QuickAddPanel.css       # 主面板样式
├── FavoriteFoods.css       # 常吃食物样式
├── RecentFoods.css         # 最近食用样式
├── QuickAddDemo.css        # 演示组件样式
├── index.ts                # 导出文件
└── README.md               # 本文档
```

## 功能特性

### QuickAddPanel
- ✅ 支持切换"常吃食物"和"最近食用"两个标签页
- ✅ 显示目标餐次类型（早餐/午餐/晚餐/加餐）
- ✅ 提供快速添加按钮
- ✅ 集成拍照识别和手动输入入口
- ✅ 响应式设计，适配移动端

### FavoriteFoods
- ✅ 网格布局显示收藏的食物
- ✅ 按使用频率排序
- ✅ 支持添加/删除收藏
- ✅ 一键添加到餐次
- ✅ 空状态提示

### RecentFoods
- ✅ 列表显示最近7天食用的食物
- ✅ 显示食物营养信息
- ✅ 一键添加到餐次
- ✅ 空状态提示

## 使用方法

### 基本用法

```tsx
import { QuickAddPanel } from './components/QuickAdd';
import { MealType, FoodItem } from './types';

function MyComponent() {
  const handleFoodAdded = (food: FoodItem) => {
    console.log('添加食物:', food);
    // 处理添加逻辑
  };

  return (
    <QuickAddPanel
      targetMealType={MealType.BREAKFAST}
      onFoodAdded={handleFoodAdded}
    />
  );
}
```

### Props

#### QuickAddPanel

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| targetMealType | MealType | 是 | 目标餐次类型 |
| onFoodAdded | (food: FoodItem) => void | 是 | 添加食物的回调函数 |

#### FavoriteFoods

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| foods | FoodItem[] | 是 | 收藏的食物列表 |
| onFoodAdd | (food: FoodItem) => void | 是 | 添加食物的回调 |
| onUpdate | () => void | 是 | 更新列表的回调 |

#### RecentFoods

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| foods | FoodItem[] | 是 | 最近食用的食物列表 |
| onFoodAdd | (food: FoodItem) => void | 是 | 添加食物的回调 |

## 演示

运行演示组件：

```tsx
import { QuickAddDemo } from './components/QuickAdd';

function App() {
  return <QuickAddDemo />;
}
```

## 依赖服务

组件依赖以下服务：

- `favoriteService.ts` - 收藏管理服务
  - `getFavoritesSortedByFrequency()` - 获取按频率排序的收藏
  - `getRecentFoods(days)` - 获取最近食用的食物
  - `addFavorite(food)` - 添加收藏
  - `removeFavorite(id)` - 删除收藏
  - `updateFrequency(foodName)` - 更新使用频率

- `mealService.ts` - 餐次管理服务
  - `getMealsByDateRange(start, end)` - 获取日期范围内的餐次

## 数据流

```
用户操作
  ↓
QuickAddPanel
  ↓
FavoriteFoods / RecentFoods
  ↓
favoriteService
  ↓
LocalStorage
```

## 样式定制

所有组件都使用独立的CSS文件，可以通过修改CSS变量来定制样式：

```css
/* 主题色 */
--primary-color: #667eea;
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 边框和阴影 */
--border-color: #e0e0e0;
--box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* 圆角 */
--border-radius: 12px;
```

## 注意事项

1. **数据持久化**: 收藏数据存储在 LocalStorage 中，键名为 `favorites`
2. **频率更新**: 每次添加食物时会自动更新使用频率
3. **最近食用**: 从餐次记录中提取，默认显示最近7天
4. **空状态**: 当没有数据时会显示友好的空状态提示
5. **响应式**: 组件在移动端会自动调整布局

## 未来改进

- [ ] 添加搜索功能
- [ ] 支持食物分类标签
- [ ] 添加食物编辑功能
- [ ] 支持批量添加
- [ ] 添加食物推荐算法

## 相关任务

- Task 15.12 - 创建QuickAddPanel组件 ✅
- Task 15.7 - 创建收藏管理服务 ✅
- Requirements: 12.10, 12.11, 12.12
