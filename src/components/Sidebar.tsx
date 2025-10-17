import React, { useState, useRef, useEffect } from 'react';
import { FileNode } from '../hooks/useFolderManager';
import FileTree from './FileTree';
import Outline from './Outline';
import './Sidebar.css';

interface SidebarProps {
  fileTree: FileNode[];
  currentFolder: string | null;
  content: string;
  onFileClick: (filePath: string) => void;
  onFolderToggle: (node: FileNode) => void;
  onOutlineItemClick?: (item: any) => void;
  onClose: () => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  selectedFile?: string;
}

type TabType = 'files' | 'outline';

const Sidebar: React.FC<SidebarProps> = ({
  fileTree,
  currentFolder,
  content,
  onFileClick,
  onFolderToggle,
  onOutlineItemClick,
  onClose,
  width = 300,
  onWidthChange,
  selectedFile
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // 更新宽度
  useEffect(() => {
    setCurrentWidth(width);
  }, [width]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  // 开始拖拽调节宽度
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // 拖拽过程中
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(200, Math.min(600, startWidthRef.current + deltaX));
    
    setCurrentWidth(newWidth);
    if (onWidthChange) {
      onWidthChange(newWidth);
    }
  };

  // 结束拖拽
  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // 清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div 
      ref={sidebarRef}
      className={`sidebar ${isResizing ? 'resizing' : ''}`}
      style={{ width: currentWidth }}
    >
      <div className="sidebar-header">
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => handleTabClick('files')}
          >
            文件
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'outline' ? 'active' : ''}`}
            onClick={() => handleTabClick('outline')}
          >
            大纲
          </button>
        </div>
        <button 
          className="sidebar-close-btn" 
          onClick={onClose}
          title="关闭侧边栏"
        >
          ×
        </button>
      </div>
      
      <div className="sidebar-content">
        {activeTab === 'files' && (
          <div className="sidebar-tab-content">
            <div className="sidebar-folder-info">
              <span title={currentFolder || '文件浏览器'}>
                {currentFolder ? currentFolder.split(/[\\/]/).pop() : '文件浏览器'}
              </span>
            </div>
            <FileTree
              fileTree={fileTree}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              selectedFile={selectedFile}
            />
          </div>
        )}
        
        {activeTab === 'outline' && (
          <div className="sidebar-tab-content">
            <Outline
              content={content}
              onItemClick={onOutlineItemClick}
            />
          </div>
        )}
      </div>
      
      {/* 拖拽调节器 */}
      <div 
        className="sidebar-resizer"
        onMouseDown={handleMouseDown}
        title="拖拽调节宽度"
      />
    </div>
  );
};

export default Sidebar;
