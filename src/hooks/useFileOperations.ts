import { useState, useCallback } from 'react';

export interface FileInfo {
  path: string;
  name: string;
  content: string;
  isModified: boolean;
}

export const useFileOperations = () => {
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'modified' | 'saving'>('saved');

  const openFile = useCallback(async () => {
    try {
      return new Promise<FileInfo>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.txt';
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string;
              const fileInfo: FileInfo = {
                path: file.name,
                name: file.name,
                content,
                isModified: false
              };
              
              setCurrentFile(fileInfo);
              
              // 添加到最近文件列表
              setRecentFiles(prev => {
                const filtered = prev.filter(f => f !== file.name);
                return [file.name, ...filtered].slice(0, 10);
              });
              
              resolve(fileInfo);
            };
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsText(file);
          } else {
            reject(new Error('未选择文件'));
          }
        };
        input.click();
      });
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

      // 保存到本地存储
      const fileKey = `markdown_file_${targetPath}`;
      localStorage.setItem(fileKey, content);
      localStorage.setItem(`${fileKey}_timestamp`, new Date().toISOString());
      
      // 同时提供下载选项
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetPath;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (currentFile) {
        setCurrentFile(prev => prev ? { ...prev, content, isModified: false } : null);
      }
      
      setSaveStatus('saved');
      
      // 显示保存成功提示
      alert(`文件已保存到本地存储！\n文件名: ${targetPath}\n同时已下载到您的下载文件夹。`);
      
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
      
      // 让用户选择文件名
      const defaultName = currentFile?.name || 'untitled.md';
      const fileName = prompt('请输入文件名:', defaultName);
      
      if (!fileName) {
        setSaveStatus('modified');
        return null;
      }
      
      // 确保文件名有.md扩展名
      const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
      
      // 保存到本地存储
      const fileKey = `markdown_file_${finalFileName}`;
      localStorage.setItem(fileKey, content);
      localStorage.setItem(`${fileKey}_timestamp`, new Date().toISOString());
      
      // 同时提供下载选项
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const fileInfo: FileInfo = {
        path: finalFileName,
        name: finalFileName,
        content,
        isModified: false
      };

      setCurrentFile(fileInfo);
      
      // 添加到最近文件列表
      setRecentFiles(prev => {
        const filtered = prev.filter(f => f !== finalFileName);
        return [finalFileName, ...filtered].slice(0, 10);
      });

      setSaveStatus('saved');
      
      // 显示保存成功提示
      alert(`文件已另存为！\n文件名: ${finalFileName}\n已保存到本地存储并下载到您的下载文件夹。`);
      
      return finalFileName;
    } catch (error) {
      console.error('另存为失败:', error);
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

  const loadFromLocalStorage = useCallback((fileName: string) => {
    const fileKey = `markdown_file_${fileName}`;
    const content = localStorage.getItem(fileKey);
    if (content) {
      const fileInfo: FileInfo = {
        path: fileName,
        name: fileName,
        content,
        isModified: false
      };
      setCurrentFile(fileInfo);
      setSaveStatus('saved');
      return fileInfo;
    }
    return null;
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
    loadFromLocalStorage,
    updateContent
  };
};
