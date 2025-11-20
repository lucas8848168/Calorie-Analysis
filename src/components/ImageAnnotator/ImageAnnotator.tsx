import React, { useState, useRef, useCallback } from 'react';
import { BoundingBox } from '../../types';
import SelectionBox from './SelectionBox';
import './ImageAnnotator.css';

interface ImageAnnotatorProps {
  imageUrl: string;
  onRegionsSelected: (regions: BoundingBox[]) => void;
}

interface DragState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentBox: BoundingBox | null;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageUrl,
  onRegionsSelected,
}) => {
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentBox: null,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取相对于图片的坐标
  const getRelativeCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      if (!imageRef.current || !containerRef.current) return null;

      const rect = imageRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      return { x, y };
    },
    []
  );

  // 开始绘制选择框
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const coords = getRelativeCoordinates(e.clientX, e.clientY);
      if (!coords) return;

      setDragState({
        isDrawing: true,
        startX: coords.x,
        startY: coords.y,
        currentBox: null,
      });
    },
    [getRelativeCoordinates]
  );

  // 拖拽绘制选择框
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragState.isDrawing) return;

      const coords = getRelativeCoordinates(e.clientX, e.clientY);
      if (!coords) return;

      const width = coords.x - dragState.startX;
      const height = coords.y - dragState.startY;

      // 创建当前绘制的选择框
      const currentBox: BoundingBox = {
        x: width >= 0 ? dragState.startX : coords.x,
        y: height >= 0 ? dragState.startY : coords.y,
        width: Math.abs(width),
        height: Math.abs(height),
      };

      setDragState((prev) => ({ ...prev, currentBox }));
    },
    [dragState.isDrawing, dragState.startX, dragState.startY, getRelativeCoordinates]
  );

  // 完成绘制
  const handleMouseUp = useCallback(() => {
    if (!dragState.isDrawing || !dragState.currentBox) {
      setDragState({
        isDrawing: false,
        startX: 0,
        startY: 0,
        currentBox: null,
      });
      return;
    }

    // 只添加有效大小的选择框（至少10x10像素）
    if (dragState.currentBox.width >= 10 && dragState.currentBox.height >= 10) {
      const newBoxes = [...boxes, dragState.currentBox];
      setBoxes(newBoxes);
      onRegionsSelected(newBoxes);
    }

    setDragState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentBox: null,
    });
  }, [dragState, boxes, onRegionsSelected]);

  // 删除选择框
  const handleDeleteBox = useCallback(
    (index: number) => {
      const newBoxes = boxes.filter((_, i) => i !== index);
      setBoxes(newBoxes);
      onRegionsSelected(newBoxes);
    },
    [boxes, onRegionsSelected]
  );

  // 清除所有选择框
  const handleClearAll = useCallback(() => {
    setBoxes([]);
    onRegionsSelected([]);
  }, [onRegionsSelected]);

  return (
    <div className="image-annotator">
      <div className="annotator-toolbar">
        <div className="toolbar-info">
          <span className="info-icon">💡</span>
          <span>点击拖拽框选食物区域 ({boxes.length} 个区域)</span>
        </div>
        {boxes.length > 0 && (
          <button className="clear-button" onClick={handleClearAll}>
            清除所有
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="annotator-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Food to annotate"
          className="annotator-image"
          draggable={false}
        />

        {/* 已保存的选择框 */}
        {boxes.map((box, index) => (
          <SelectionBox
            key={index}
            box={box}
            index={index}
            onDelete={handleDeleteBox}
          />
        ))}

        {/* 当前正在绘制的选择框 */}
        {dragState.currentBox && (
          <div
            className="selection-box drawing"
            style={{
              left: `${dragState.currentBox.x}px`,
              top: `${dragState.currentBox.y}px`,
              width: `${dragState.currentBox.width}px`,
              height: `${dragState.currentBox.height}px`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageAnnotator;
