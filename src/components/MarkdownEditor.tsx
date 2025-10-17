import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { 
  FileText, Save, FolderOpen, Plus, Download, Settings, Folder, Image, Moon, Sun
} from 'lucide-react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useFileOperationsTauri } from '../hooks/useFileOperationsTauri';
import { useFolderManager } from '../hooks/useFolderManager';
import { useEditorOperations } from '../hooks/useEditorOperations';
import { useTheme } from '../hooks/useTheme';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import SettingsModal from './SettingsModal';
import Sidebar from './Sidebar';
import EditDropdown from './EditDropdown';
import './MarkdownEditor.css';

const MarkdownEditor: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showFileTree, setShowFileTree] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(300);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  
  // 编辑器引用
  const editorRef = useRef<any>(null);
  
  // 检测是否在Tauri环境中
  const isTauri = typeof window !== 'undefined' && (
    (window as any).__TAURI__ || 
    (window as any).__TAURI_INTERNALS__ ||
    typeof (window as any).__TAURI_METADATA__ !== 'undefined'
  );
  
  console.log('Tauri环境检测:', {
    hasWindow: typeof window !== 'undefined',
    hasTauri: !!(window as any).__TAURI__,
    hasTauriInternals: !!(window as any).__TAURI_INTERNALS__,
    hasTauriMetadata: typeof (window as any).__TAURI_METADATA__ !== 'undefined',
    isTauri
  });
  
  // 强制使用Tauri版本（因为我们在Tauri应用中）
  const {
    currentFile,
    saveStatus,
    openFile,
    saveAsFile,
    newFile,
    updateContent,
    setCurrentFileInfo
  } = useFileOperationsTauri();

  // 文件夹管理
  const {
    currentFolder,
    fileTree,
    isLoading: isFolderLoading,
    openFolder,
    openFile: openFileFromTree,
    createFile,
    toggleFolder
  } = useFolderManager();

  // 编辑操作
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    copy,
    paste,
    cut,
    selectAll,
    saveHistory
  } = useEditorOperations(value, setValue, editorRef);

  // 主题管理
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (currentFile) {
      setValue(currentFile.content);
    }
  }, [currentFile]);

  const handleContentChange = (val?: string) => {
    const newValue = val || '';
    setValue(newValue);
    updateContent(newValue);
    // 保存到历史记录（延迟保存，避免频繁操作）
    setTimeout(() => saveHistory(newValue), 100);
  };

  const handleNewFile = async () => {
    if (currentFile?.isModified) {
      const shouldSave = window.confirm('当前文件有未保存的更改，是否保存？');
      if (shouldSave) {
        await handleSave();
      }
    }
    
    // 如果打开了文件夹，在当前文件夹创建新文件
    if (currentFolder) {
      const fileName = prompt('请输入文件名:', 'untitled.md');
      if (fileName) {
        try {
          const filePath = await createFile(fileName, '');
          alert(`新文件已创建: ${filePath}`);
          
          // 设置当前文件信息，确保后续保存到正确位置
          const newFileInfo = {
            path: filePath,
            name: fileName,
            content: '',
            isModified: false
          };
          
          // 设置当前文件信息
          setCurrentFileInfo(newFileInfo);
          setValue('');
          
          console.log('新建文件信息:', newFileInfo);
        } catch (error) {
          console.error('创建文件失败:', error);
          alert('创建文件失败');
        }
      }
    } else {
      newFile();
    }
  };

  const handleOpenFile = async () => {
    try {
      setIsLoading(true);
      await openFile();
    } catch (error) {
      console.error('打开文件失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // 如果当前文件有完整路径，直接保存到该路径
      if (currentFile?.path && (currentFile.path.includes('/') || currentFile.path.includes('\\'))) {
        console.log('保存现有文件到原位置:', currentFile.path);
        try {
          await writeTextFile(currentFile.path, value);
          alert(`文件已保存到: ${currentFile.path}`);
          // 更新文件状态为已保存
          setCurrentFileInfo({
            ...currentFile,
            content: value,
            isModified: false
          });
        } catch (error) {
          console.error('保存文件失败:', error);
          // 如果保存失败，使用另存为
          await saveAsFile(value);
        }
      } else if (currentFolder) {
        // 如果在文件夹模式下，保存到当前文件夹
        console.log('文件夹模式，保存到当前文件夹:', currentFolder);
        const fileName = currentFile?.name || 'untitled.md';
        const filePath = `${currentFolder}\\${fileName}`;
        try {
          await writeTextFile(filePath, value);
          alert(`文件已保存到: ${filePath}`);
          // 更新当前文件信息
          setCurrentFileInfo({
            path: filePath,
            name: fileName,
            content: value,
            isModified: false
          });
        } catch (error) {
          console.error('保存到文件夹失败:', error);
          // 如果保存失败，使用另存为
          await saveAsFile(value);
        }
      } else {
        // 对于新建文件或没有完整路径的文件，使用另存为
        console.log('新建文件，使用另存为功能');
        await saveAsFile(value);
      }
    } catch (error) {
      console.error('保存文件失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAs = async () => {
    try {
      setIsLoading(true);
      await saveAsFile(value);
    } catch (error) {
      console.error('另存为失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 打开文件夹
  const handleOpenFolder = async () => {
    try {
      await openFolder();
      setShowFileTree(true);
    } catch (error) {
      console.error('打开文件夹失败:', error);
    }
  };

  // 从文件树打开文件
  const handleFileTreeClick = async (filePath: string) => {
    console.log('MarkdownEditor收到文件点击事件:', filePath);
    try {
      const content = await openFileFromTree(filePath);
      console.log('文件内容读取成功，长度:', content.length);
      setValue(content);
      setSelectedFile(filePath);
      
      // 设置当前文件信息
      const fileName = filePath.split(/[\\/]/).pop() || 'untitled';
      const fileInfo = {
        path: filePath,
        name: fileName,
        content: content,
        isModified: false
      };
      
      setCurrentFileInfo(fileInfo);
      console.log('从文件树打开文件:', fileInfo);
    } catch (error) {
      console.error('打开文件失败:', error);
    }
  };

  // 切换文件夹展开状态
  const handleFolderToggle = (node: any) => {
    toggleFolder(node);
  };

  // 处理大纲项点击
  const handleOutlineItemClick = (item: any) => {
    console.log('大纲项点击:', item);
    // 这里可以添加跳转到对应标题的功能
    // 由于MDEditor的限制，暂时只打印日志
  };

  // 处理侧边栏宽度变化
  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  // 插入图片
  const handleInsertImage = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            // 将图片转换为base64数据URL
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageDataUrl = e.target?.result as string;
              if (imageDataUrl) {
                // 在光标位置插入图片
                const textarea = editorRef.current?.textarea;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const imageMarkdown = `![${file.name}](${imageDataUrl})`;
                  const newContent = value.substring(0, start) + imageMarkdown + value.substring(end);
                  setValue(newContent);
                  updateContent(newContent);
                  saveHistory(newContent);
                  
                  // 设置光标位置
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                    textarea.focus();
                  }, 0);
                }
              }
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.error('处理图片文件失败:', error);
            alert('插入图片失败，请重试');
          }
        }
      };
      input.click();
    } catch (error) {
      console.error('插入图片失败:', error);
      alert('插入图片失败，请重试');
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          if (e.shiftKey) {
            handleSaveAs();
          } else {
            handleSave();
          }
          break;
        case 'o':
          e.preventDefault();
          handleOpenFile();
          break;
        case 'n':
          e.preventDefault();
          handleNewFile();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 'c':
          e.preventDefault();
          copy();
          break;
        case 'v':
          e.preventDefault();
          paste();
          break;
        case 'x':
          e.preventDefault();
          cut();
          break;
        case 'a':
          e.preventDefault();
          selectAll();
          break;
      }
    }
  };

  return (
    <div className="markdown-editor" onKeyDown={handleKeyDown}>
      {/* 工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button 
            className="toolbar-btn" 
            onClick={handleNewFile}
            title="新建文件 (Ctrl+N)"
          >
            <Plus size={16} />
            新建
          </button>
          <button 
            className="toolbar-btn" 
            onClick={handleOpenFile}
            disabled={isLoading}
            title="打开文件 (Ctrl+O)"
          >
            <FolderOpen size={16} />
            打开
          </button>
          <button 
            className="toolbar-btn" 
            onClick={handleOpenFolder}
            disabled={isFolderLoading}
            title="打开文件夹"
          >
            <Folder size={16} />
            打开文件夹
          </button>
          <button 
            className="toolbar-btn" 
            onClick={handleInsertImage}
            title="插入图片"
          >
            <Image size={16} />
            插入图片
          </button>
          
          {/* 分隔线 */}
          <div className="toolbar-separator"></div>
          
          {/* 编辑操作下拉菜单 */}
          <EditDropdown
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onCopy={copy}
            onPaste={paste}
            onCut={cut}
            onSelectAll={selectAll}
          />
          
          <div className="toolbar-separator"></div>
          
          <button 
            className="toolbar-btn" 
            onClick={handleSave}
            disabled={isLoading}
            title="保存文件 (Ctrl+S)"
          >
            <Save size={16} />
            保存
          </button>
          <button 
            className="toolbar-btn" 
            onClick={handleSaveAs}
            disabled={isLoading}
            title="另存为 (Ctrl+Shift+S)"
          >
            <Download size={16} />
            另存为
          </button>
        </div>
        
        <div className="toolbar-center">
          <span className="file-name">
            {currentFile?.name || '未命名.md'}
            {currentFile?.isModified && <span className="modified-indicator">*</span>}
          </span>
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === 'saved' && '✓ 已保存'}
            {saveStatus === 'modified' && '● 未保存'}
            {saveStatus === 'saving' && '⏳ 保存中...'}
          </span>
        </div>
        
        <div className="toolbar-right">
          <button 
            className="toolbar-btn"
            onClick={toggleTheme}
            title={`切换到${theme === 'light' ? '暗夜' : '明亮'}模式`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? '暗夜' : '明亮'}
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="设置"
          >
            <Settings size={16} />
            设置
          </button>
          <button 
            className={`toolbar-btn ${isPreview ? 'active' : ''}`}
            onClick={() => setIsPreview(!isPreview)}
            title="切换预览模式"
          >
            <FileText size={16} />
            {isPreview ? '编辑模式' : '预览模式'}
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="main-content">
        {/* 侧边栏 */}
        {showFileTree && (
          <Sidebar
            fileTree={fileTree}
            currentFolder={currentFolder}
            content={value}
            onFileClick={handleFileTreeClick}
            onFolderToggle={handleFolderToggle}
            onOutlineItemClick={handleOutlineItemClick}
            onClose={() => setShowFileTree(false)}
            width={sidebarWidth}
            onWidthChange={handleSidebarWidthChange}
            selectedFile={selectedFile}
          />
        )}

        {/* 编辑器区域 */}
        <div className="editor-container">
          <MDEditor
            ref={editorRef}
            value={value}
            onChange={handleContentChange}
            data-color-mode={theme}
            height={600}
            visibleDragbar={false}
            preview={isPreview ? 'preview' : 'edit'}
            hideToolbar={false}
            previewOptions={{
              rehypePlugins: [rehypeHighlight],
              remarkPlugins: [remarkGfm]
            }}
            textareaProps={{
              placeholder: '开始编写您的Markdown文档...',
              style: {
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace'
              }
            }}
          />
        </div>
      </div>

      {/* 设置模态框 */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default MarkdownEditor;
