import React from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Image, FileText } from 'lucide-react';
import { FileNode } from '../hooks/useFolderManager';
import './FileTree.css';

interface FileTreeProps {
  fileTree: FileNode[];
  onFileClick: (filePath: string) => void;
  onFolderToggle: (node: FileNode) => void;
  selectedFile?: string;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree, onFileClick, onFolderToggle, selectedFile }) => {
  const getFileIcon = (node: FileNode) => {
    if (node.type === 'directory') {
      return node.isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />;
    }
    
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <Image size={16} />;
      case 'md':
      case 'markdown':
      case 'txt':
        return <FileText size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const handleNodeClick = (node: FileNode, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('FileTree点击事件:', node);
    if (node.type === 'directory') {
      console.log('点击文件夹:', node.name);
      onFolderToggle(node);
    } else {
      console.log('点击文件:', node.name, node.path);
      onFileClick(node.path);
    }
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isSelected = selectedFile === node.path;
    
    return (
      <div key={node.path} className="file-tree-node">
        <div
          className={`file-tree-item ${node.type} ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={(e) => handleNodeClick(node, e)}
        >
          {node.type === 'directory' && (
            <span className="expand-icon">
              {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          <span className="file-icon">{getFileIcon(node)}</span>
          <span className="file-name">
            {node.type === 'directory' && (
              <span className="folder-name-icon">
                {node.isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />}
              </span>
            )}
            {node.name}
          </span>
        </div>
        
        {node.type === 'directory' && node.isExpanded && node.children && (
          <div className="file-tree-children">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-tree">
      {fileTree.length === 0 ? (
        <div className="file-tree-empty">
          <p>请打开一个文件夹</p>
        </div>
      ) : (
        fileTree.map(node => renderNode(node))
      )}
    </div>
  );
};

export default FileTree;
