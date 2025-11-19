# Bug 修复文档

**发现时间**: 2025-11-19  
**版本**: v2.0.1  
**状态**: 🔧 修复中

---

## 🐛 发现的问题

### 问题 1: 白色文字在白色背景上

**描述**: 进度条标签文字颜色为白色，在白色背景上不可见

**位置**: `src/components/AnalysisDisplay.tsx` - 进度条区域

**影响**: 用户无法看到"已摄入 17%"等文字

**严重程度**: 🔴 高

**复现步骤**:
1. 上传食物图片
2. 查看总卡路里卡片
3. 观察进度条下方的文字

**问题代码**:
```tsx
<div className="progress-label">
  已摄入 {Math.round(caloriePercentage)}%
</div>
```

**CSS问题**:
```css
.progress-label {
  text-align: center;
  margin-top: var(--spacing-sm);
  font-size: var(--font-sm);
  opacity: 0.9;
  /* 缺少 color 属性，继承了白色 */
}
```

**修复方案**:
```css
.progress-label {
  text-align: center;
  margin-top: var(--spacing-sm);
  font-size: var(--font-sm);
  opacity: 0.95;
  color: white; /* 明确设置为白色，因为父容器是紫色渐变 */
}
```

---

### 问题 2: 浮点数精度问题

**描述**: 卡路里显示为 344.29999999999995 而不是 344.3

**位置**: `src/components/AnalysisDisplay.tsx` - 数字滚动动画

**影响**: 显示不美观，用户体验差

**严重程度**: 🟡 中

**复现步骤**:
1. 上传食物图片
2. 查看总卡路里数字
3. 观察小数点后的数字

**问题代码**:
```tsx
const [animatedCalories, setAnimatedCalories] = useState(0);

useEffect(() => {
  if (result && result.totalCalories > 0) {
    let start = 0;
    const end = result.totalCalories; // 可能是浮点数
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCalories(end); // 直接使用浮点数
        clearInterval(timer);
      } else {
        setAnimatedCalories(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }
}, [result]);

// 显示
<div className="calories-number">
  {animatedCalories} {/* 直接显示，没有格式化 */}
  <span className="calories-unit">kcal</span>
</div>
```

**修复方案**:
```tsx
// 1. 在动画结束时四舍五入
useEffect(() => {
  if (result && result.totalCalories > 0) {
    let start = 0;
    const end = Math.round(result.totalCalories * 10) / 10; // 保留1位小数
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCalories(end);
        clearInterval(timer);
      } else {
        setAnimatedCalories(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }
}, [result]);

// 2. 在显示时格式化
<div className="calories-number">
  {animatedCalories === Math.floor(animatedCalories) 
    ? animatedCalories 
    : animatedCalories.toFixed(1)}
  <span className="calories-unit">kcal</span>
</div>
```

---

### 问题 3: 后台分析问题

**描述**: 用户切换到其他标签页时，分析可能中断或无法继续

**位置**: `src/App.tsx` - 状态管理

**影响**: 用户体验差，需要重新上传

**严重程度**: 🟡 中

**复现步骤**:
1. 上传食物图片
2. 在加载过程中切换到"历史记录"标签
3. 分析可能中断

**问题代码**:
```tsx
const [state, setState] = useState<AppState>('upload');

const handleImageProcessed = async (image: ProcessedImage) => {
  setCurrentImage(image);
  setError(null);
  setState('analyzing'); // 切换状态

  try {
    const response = await analyzeFood(image.dataUrl, image.format);
    // ... 处理响应
    setState('result'); // 切换到结果页
  } catch (err: any) {
    setError(err.message);
    setState('upload'); // 出错返回上传页
  }
};

// 用户点击"历史记录"会改变 state
const handleShowHistory = () => {
  setState('history'); // 这会隐藏加载页面
};
```

**修复方案**:

**方案 A: 阻止切换（推荐）**
```tsx
const [isAnalyzing, setIsAnalyzing] = useState(false);

const handleImageProcessed = async (image: ProcessedImage) => {
  setIsAnalyzing(true);
  setState('analyzing');

  try {
    const response = await analyzeFood(image.dataUrl, image.format);
    // ... 处理响应
    setState('result');
  } catch (err: any) {
    setError(err.message);
    setState('upload');
  } finally {
    setIsAnalyzing(false);
  }
};

// 禁用导航按钮
<button
  className={state === 'history' ? 'active' : ''}
  onClick={handleShowHistory}
  disabled={isAnalyzing} // 分析时禁用
>
  历史记录
</button>
`