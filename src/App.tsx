import { useState, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import LoadingIndicator from './components/LoadingIndicator';
import AnalysisDisplay from './components/AnalysisDisplay';
import HistoryList from './components/HistoryList';
import { ProcessedImage, AnalysisResult } from './types';
import { analyzeFood } from './services/apiClient';
import { parseAnalysisResponse } from './utils/dataParser';
import { historyStorage } from './services/historyStorage';
import './App.css';

type AppState = 'upload' | 'analyzing' | 'result' | 'history';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [, setCurrentImage] = useState<ProcessedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analysisInProgressRef = useRef<boolean>(false);

  const handleImageProcessed = async (image: ProcessedImage) => {
    setCurrentImage(image);
    setError(null);
    setState('analyzing');
    analysisInProgressRef.current = true;

    try {
      // 调用API分析图片
      const response = await analyzeFood(image.dataUrl, image.format);

      // 检查分析是否被中断（用户切换到其他页面）
      if (!analysisInProgressRef.current) {
        console.log('分析已被中断，不更新状态');
        return;
      }

      // 解析响应
      const result = parseAnalysisResponse(response);

      if (result) {
        // 检查特殊情况
        if (response.data?.confidence === 'unclear') {
          setError('图片不够清晰，无法准确识别食物。请重新上传清晰的图片。');
          setState('upload');
          analysisInProgressRef.current = false;
          return;
        }
        
        if (response.data?.confidence === 'not_food') {
          setError('这张图片不是食物图片。请上传包含食物的图片。');
          setState('upload');
          analysisInProgressRef.current = false;
          return;
        }

        // 设置图片URL
        result.imageUrl = image.dataUrl;

        // 保存到历史记录
        historyStorage.saveRecord(result);

        // 显示结果
        setAnalysisResult(result);
        setState('result');
      } else {
        throw new Error('解析响应失败');
      }
    } catch (err: any) {
      // 只有在分析未被中断时才显示错误
      if (analysisInProgressRef.current) {
        setError(err.message || '分析失败，请稍后重试');
        setState('upload');
      }
    } finally {
      analysisInProgressRef.current = false;
    }
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  const handleNewAnalysis = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setError(null);
    setState('upload');
  };

  const handleShowHistory = () => {
    // 如果正在分析，标记为中断
    if (analysisInProgressRef.current) {
      analysisInProgressRef.current = false;
    }
    setState('history');
  };

  const handleSelectRecord = (record: AnalysisResult) => {
    setAnalysisResult(record);
    setState('result');
  };

  const handleBackToUpload = () => {
    // 如果正在分析，标记为中断
    if (analysisInProgressRef.current) {
      analysisInProgressRef.current = false;
    }
    setState('upload');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ 食物卡路里分析器</h1>
        <p className="subtitle">上传食物图片，AI 智能识别营养成分</p>
      </header>

      <nav className="app-nav">
        <button
          className={state === 'upload' || state === 'analyzing' || state === 'result' ? 'active' : ''}
          onClick={handleBackToUpload}
          disabled={analysisInProgressRef.current}
        >
          分析
        </button>
        <button
          className={state === 'history' ? 'active' : ''}
          onClick={handleShowHistory}
          disabled={analysisInProgressRef.current}
        >
          历史记录
        </button>
      </nav>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {state === 'upload' && (
          <ImageUploader
            onImageProcessed={handleImageProcessed}
            onError={handleError}
          />
        )}

        {state === 'analyzing' && (
          <div>
            <LoadingIndicator message="正在分析食物，请稍候..." />
            <p className="loading-hint">
              💡 提示：豆包 AI 分析通常需要 30-60 秒，复杂图片可能需要 1-2 分钟
            </p>
            <p className="loading-hint" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999' }}>
              如果图片包含多种食物（&gt;10种），AI 将只识别主要食物以加快速度
            </p>
          </div>
        )}

        {state === 'result' && analysisResult && (
          <AnalysisDisplay
            result={analysisResult}
            onNewAnalysis={handleNewAnalysis}
          />
        )}

        {state === 'history' && (
          <HistoryList onSelectRecord={handleSelectRecord} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          由方舟豆包 1.6 大模型提供支持 | 数据仅供参考
        </p>
      </footer>
    </div>
  );
}

export default App;
