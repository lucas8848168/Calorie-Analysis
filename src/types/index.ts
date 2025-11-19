// 营养成分信息
export interface NutritionInfo {
  protein: number; // 蛋白质（克）
  fat: number; // 脂肪（克）
  carbs: number; // 碳水化合物（克）
  fiber: number; // 膳食纤维（克）
}

// 单个食物项
export interface FoodItem {
  name: string;
  portion?: string; // 份量说明
  ingredients?: string; // 材料成分
  calories: number;
  nutrition: NutritionInfo;
}

// 分析结果
export interface AnalysisResult {
  id: string; // UUID
  timestamp: number; // Unix时间戳
  imageUrl: string; // Base64或ObjectURL
  foods: FoodItem[];
  totalCalories: number;
  confidence?: string;
}

// 图片元数据
export interface ImageMetadata {
  originalSize: number;
  compressedSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: 'jpeg' | 'png' | 'webp';
}

// 处理后的图片
export interface ProcessedImage {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  dimensions: { width: number; height: number };
  format: 'jpeg' | 'png' | 'webp';
}

// API请求
export interface AnalyzeRequest {
  image: string; // Base64编码的图片
  format: string; // 图片格式
}

// API响应
export interface AnalyzeResponse {
  success: boolean;
  data?: {
    foods: Array<{
      name: string;
      calories: number;
      nutrition: {
        protein: number;
        fat: number;
        carbs: number;
        fiber: number;
      };
    }>;
    totalCalories: number;
    confidence?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// 错误响应
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
  };
}

// 组件Props类型
export interface ImageUploaderProps {
  onImageProcessed: (processedImage: ProcessedImage) => void;
  onError: (error: Error) => void;
}

export interface AnalysisDisplayProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export interface HistoryListProps {
  onSelectRecord: (record: AnalysisResult) => void;
}

export interface LoadingIndicatorProps {
  message?: string;
  progress?: number;
}

// 存储接口
export interface HistoryStorage {
  saveRecord(record: AnalysisResult): void;
  getRecords(): AnalysisResult[];
  deleteRecord(timestamp: number): void;
  clearAll(): void;
}
