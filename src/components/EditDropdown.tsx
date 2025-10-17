import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, Redo, Copy, Clipboard, Scissors, MousePointer, ChevronDown 
} from 'lucide-react';
import './EditDropdown.css';

interface EditDropdownProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onCut: () => void;
  onSelectAll: () => void;
}

const EditDropdown: React.FC<EditDropdownProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onCut,
  onSelectAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="edit-dropdown" ref={dropdownRef}>
      <button 
        className="toolbar-btn dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="编辑操作"
      >
        编辑
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onUndo)}
            disabled={!canUndo}
            title="撤销 (Ctrl+Z)"
          >
            <Undo size={16} />
            撤销
          </button>
          
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onRedo)}
            disabled={!canRedo}
            title="重做 (Ctrl+Y)"
          >
            <Redo size={16} />
            重做
          </button>
          
          <div className="dropdown-separator"></div>
          
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onCopy)}
            title="复制 (Ctrl+C)"
          >
            <Copy size={16} />
            复制
          </button>
          
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onPaste)}
            title="粘贴 (Ctrl+V)"
          >
            <Clipboard size={16} />
            粘贴
          </button>
          
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onCut)}
            title="剪切 (Ctrl+X)"
          >
            <Scissors size={16} />
            剪切
          </button>
          
          <div className="dropdown-separator"></div>
          
          <button 
            className="dropdown-item"
            onClick={() => handleItemClick(onSelectAll)}
            title="全选 (Ctrl+A)"
          >
            <MousePointer size={16} />
            全选
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDropdown;
