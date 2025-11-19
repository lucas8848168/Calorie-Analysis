import { ImageMetadata, ProcessedImage } from '../types';

// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1024; // 降低到1024以加快处理
const MAX_COMPRESSED_SIZE = 1 * 1024 * 1024; // 1MB

/**
 * 验证文件格式
 */
export function validateFileFormat(file: File): boolean {
  if (!file || !file.type) {
    throw new Error('INVALID_FILE_FORMAT');
  }
  
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    throw new Error('INVALID_FILE_FORMAT');
  }
  
  return true;
}

/**
 * 检查文件大小
 */
export function validateFileSize(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('FILE_TOO_LARGE');
  }
  return true;
}

/**
 * 检测图片分辨率
 */
export function detectImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_DECODE_ERROR'));
    };
    
    img.src = url;
  });
}

/**
 * 提取图片元数据
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  const dimensions = await detectImageDimensions(file);
  
  // 从MIME类型提取格式
  let format: 'jpeg' | 'png' | 'webp' = 'jpeg';
  if (file.type === 'image/png') format = 'png';
  else if (file.type === 'image/webp') format = 'webp';
  
  return {
    originalSize: file.size,
    compressedSize: file.size,
    dimensions,
    format,
  };
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File,
  maxDimension: number = MAX_DIMENSION,
  maxSize: number = MAX_COMPRESSED_SIZE
): Promise<ProcessedImage> {
  const metadata = await extractImageMetadata(file);
  const { width, height } = metadata.dimensions;
  
  // 计算新尺寸
  let newWidth = width;
  let newHeight = height;
  
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    newWidth = Math.floor(width * ratio);
    newHeight = Math.floor(height * ratio);
  }
  
  // 创建canvas进行压缩
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('COMPRESSION_FAILED');
  }
  
  // 加载图片
  const img = await loadImage(file);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
  // 渐进式压缩直到满足大小要求
  let quality = 0.9;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  
  while (dataUrl.length > maxSize && quality > 0.1) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  
  // 计算压缩后的大小（Base64字符串长度约为实际字节数的1.37倍）
  const compressedSize = Math.floor(dataUrl.length * 0.75);
  
  return {
    dataUrl,
    originalSize: file.size,
    compressedSize,
    dimensions: { width: newWidth, height: newHeight },
    format: 'jpeg',
  };
}

/**
 * 加载图片为Image对象
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_DECODE_ERROR'));
    };
    
    img.src = url;
  });
}

/**
 * 处理图片（验证、检测、压缩）
 */
export async function processImage(file: File): Promise<ProcessedImage> {
  // 验证文件
  validateFileFormat(file);
  validateFileSize(file);
  
  // 检测元数据
  const metadata = await extractImageMetadata(file);
  
  // 判断是否需要压缩
  const needsCompression =
    metadata.dimensions.width > MAX_DIMENSION ||
    metadata.dimensions.height > MAX_DIMENSION ||
    file.size > MAX_COMPRESSED_SIZE;
  
  if (needsCompression) {
    return await compressImage(file);
  }
  
  // 不需要压缩，直接转换为DataURL
  const dataUrl = await fileToDataUrl(file);
  return {
    dataUrl,
    originalSize: file.size,
    compressedSize: file.size,
    dimensions: metadata.dimensions,
    format: metadata.format,
  };
}

/**
 * 将File转换为DataURL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('IMAGE_DECODE_ERROR'));
    reader.readAsDataURL(file);
  });
}
