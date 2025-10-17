import { useState, useCallback } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

export interface FileInfo {
  path: string;
  name: string;
  content: string;
  isModified: boolean;
}

export const useFileOperationsTauri = () => {
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'modified' | 'saving'>('saved');

  const openFile = useCallback(async () => {
    try {
      // 使用Tauri的文件对话框
      const selectedPath = await open({
        multiple: false,
        filters: [
          {
            name: 'Markdown & Text Files',
            extensions: ['md', 'markdown', 'txt']
          },
          {
            name: 'Markdown Files',
            extensions: ['md', 'markdown']
          },
          {
            name: 'Text Files',
            extensions: ['txt']
          }
        ]
      });

      if (selectedPath && typeof selectedPath === 'string') {
        const content = await readTextFile(selectedPath);
        const fileName = selectedPath.split(/[\\/]/).pop() || 'untitled';
        
        const fileInfo: FileInfo = {
          path: selectedPath,
          name: fileName,
          content,
          isModified: false
        };
        
        setCurrentFile(fileInfo);
        setSaveStatus('saved');
        
        // 添加到最近文件列表
        setRecentFiles(prev => {
          const filtered = prev.filter(f => f !== selectedPath);
          return [selectedPath, ...filtered].slice(0, 10);
        });
        
        return fileInfo;
      } else {
        throw new Error('未选择文件');
      }
    } catch (error) {
      console.error('打开文件失败:', error);
      throw error;
    }
  }, []);

  const saveFile = useCallback(async (content: string, filePath?: string) => {
    try {
      setSaveStatus('saving');
      const targetPath = filePath || currentFile?.path;
      
      if (!targetPath) {
        return await saveAsFile(content);
      }

      // 如果当前文件没有完整路径（比如新建的文件），使用另存为
      if (!targetPath.includes('/') && !targetPath.includes('\\')) {
        return await saveAsFile(content);
      }

      // 使用Tauri的文件系统API真正保存文件
      console.log('保存文件到:', targetPath);
      await writeTextFile(targetPath, content);
      console.log('文件保存成功!');
      
      if (currentFile) {
        setCurrentFile(prev => prev ? { ...prev, content, isModified: false } : null);
      }
      
      setSaveStatus('saved');
      return targetPath;
    } catch (error) {
      console.error('保存文件失败:', error);
      setSaveStatus('modified');
      throw error;
    }
  }, [currentFile]);

  const saveAsFile = useCallback(async (content: string) => {
    try {
      setSaveStatus('saving');
      
      // 使用Tauri的保存对话框让用户选择保存位置和文件名
      const defaultName = currentFile?.name || 'untitled.md';
      console.log('另存为 - 默认文件名:', defaultName);
      
      console.log('准备打开保存对话框...');
      const selectedPath = await save({
        title: '另存为',
        defaultPath: defaultName,
        filters: [
          {
            name: 'Markdown Files',
            extensions: ['md', 'markdown']
          },
          {
            name: 'Text Files',
            extensions: ['txt']
          },
          {
            name: 'All Files',
            extensions: ['*']
          }
        ]
      });
      console.log('保存对话框已关闭，返回值:', selectedPath);

      console.log('另存为 - 用户选择的路径:', selectedPath);

      if (!selectedPath) {
        console.log('用户取消了另存为操作');
        setSaveStatus('modified');
        return null;
      }

      // 使用Tauri的文件系统API真正保存文件
      console.log('开始写入文件到:', selectedPath);
      
      try {
        await writeTextFile(selectedPath, content);
        console.log('另存为 - 文件写入成功!');
      } catch (writeError) {
        console.error('另存为 - 文件写入失败:', writeError);
        if (writeError instanceof Error && writeError.message.includes('forbidden')) {
          throw new Error(`无法保存到该路径，可能是权限不足或路径包含特殊字符: ${selectedPath}`);
        }
        throw writeError;
      }
      
      const fileName = selectedPath.split(/[\\/]/).pop() || 'untitled';
      const fileInfo: FileInfo = {
        path: selectedPath,
        name: fileName,
        content,
        isModified: false
      };

      setCurrentFile(fileInfo);
      setSaveStatus('saved');
      
      // 添加到最近文件列表
      setRecentFiles(prev => {
        const filtered = prev.filter(f => f !== selectedPath);
        return [selectedPath, ...filtered].slice(0, 10);
      });

      alert(`文件已另存为: ${selectedPath}`);
      return selectedPath;
    } catch (error) {
      console.error('另存为失败:', error);
      alert(`另存为失败: ${error instanceof Error ? error.message : String(error)}`);
      setSaveStatus('modified');
      throw error;
    }
  }, [currentFile]);


  const newFile = useCallback(() => {
    const fileInfo: FileInfo = {
      path: '',
      name: '未命名.md',
      content: '',
      isModified: false
    };
    setCurrentFile(fileInfo);
    setSaveStatus('saved');
  }, []);

  const setCurrentFileInfo = useCallback((fileInfo: FileInfo) => {
    setCurrentFile(fileInfo);
    setSaveStatus('saved');
  }, []);

  const updateContent = useCallback((content: string) => {
    if (currentFile) {
      setCurrentFile(prev => prev ? { ...prev, content, isModified: true } : null);
      setSaveStatus('modified');
    }
  }, [currentFile]);

  return {
    currentFile,
    recentFiles,
    saveStatus,
    openFile,
    saveFile,
    saveAsFile,
    newFile,
    updateContent,
    setCurrentFileInfo
  };
};
