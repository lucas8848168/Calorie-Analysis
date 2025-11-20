import React from 'react';
import { BoundingBox } from '../../types';

interface SelectionBoxProps {
  box: BoundingBox;
  index: number;
  onDelete: (index: number) => void;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ box, index, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(index);
  };

  return (
    <div
      className="selection-box"
      style={{
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      }}
    >
      <div className="selection-box-label">
        <span className="box-number">#{index + 1}</span>
        <button
          className="delete-button"
          onClick={handleDelete}
          title="删除此区域"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SelectionBox;
