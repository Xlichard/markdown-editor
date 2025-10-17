import { useState, useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, readTextFile, writeTextFile, copyFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  isExpanded?: boolean;
}

export interface FolderManager {
  currentFolder: string | null;
  fileTree: FileNode[];
  isLoading: boolean;
  openFolder: () => Promise<void>;
  refreshFolder: () => Promise<void>;
  openFile: (filePath: string) => Promise<string>;
  saveFile: (filePath: string, content: string) => Promise<void>;
  createFile: (fileName: string, content: string) => Promise<string>;
  insertImage: (imagePath: string) => Promise<string>;
  toggleFolder: (node: FileNode) => void;
}

export const useFolderManager = (): FolderManager => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 构建文件树
  const buildFileTree = useCallback(async (dirPath: string): Promise<FileNode[]> => {
    try {
      const entries = await readDir(dirPath);
      const nodes: FileNode[] = [];

      console.log('读取目录:', dirPath, '条目数量:', entries.length);

      for (const entry of entries) {
        const name = entry.name;
        const path = await join(dirPath, entry.name);
        const isDirectory = entry.isDirectory;
        
        console.log('处理条目:', { name, path, isDirectory });
        
        const node: FileNode = {
          name: name,
          path: path,
          type: isDirectory ? 'directory' : 'file',
          isExpanded: false
        };

        console.log('创建节点:', node);

        if (isDirectory) {
          // 不立即加载子目录，等到展开时再加载
          node.children = [];
        }

        nodes.push(node);
      }

      // 排序：文件夹在前，文件在后，按名称排序
      return nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('构建文件树失败:', error);
      return [];
    }
  }, []);

  // 打开文件夹
  const openFolder = useCallback(async () => {
    try {
      setIsLoading(true);
      const selectedPath = await open({
        directory: true,
        multiple: false
      });

      if (selectedPath && typeof selectedPath === 'string') {
        setCurrentFolder(selectedPath);
        const tree = await buildFileTree(selectedPath);
        setFileTree(tree);
        console.log('文件夹已打开:', selectedPath);
      }
    } catch (error) {
      console.error('打开文件夹失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [buildFileTree]);

  // 刷新文件夹
  const refreshFolder = useCallback(async () => {
    if (!currentFolder) return;
    
    try {
      setIsLoading(true);
      const tree = await buildFileTree(currentFolder);
      setFileTree(tree);
    } catch (error) {
      console.error('刷新文件夹失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, buildFileTree]);

  // 打开文件
  const openFile = useCallback(async (filePath: string): Promise<string> => {
    try {
      console.log('正在打开文件:', filePath);
      const content = await readTextFile(filePath);
      console.log('文件内容已读取, 长度:', content.length);
      return content;
    } catch (error) {
      console.error('打开文件失败:', error, typeof error);
      // 尝试再次读取，有时候第一次读取会失败
      try {
        console.log('尝试再次读取文件:', filePath);
        const content = await readTextFile(filePath);
        return content;
      } catch (retryError) {
        console.error('再次读取文件失败:', retryError);
        throw error;
      }
    }
  }, []);

  // 保存文件
  const saveFile = useCallback(async (filePath: string, content: string): Promise<void> => {
    try {
      await writeTextFile(filePath, content);
      // 刷新文件树
      await refreshFolder();
    } catch (error) {
      console.error('保存文件失败:', error);
      throw error;
    }
  }, [refreshFolder]);

  // 在当前文件夹创建新文件
  const createFile = useCallback(async (fileName: string, content: string): Promise<string> => {
    if (!currentFolder) {
      throw new Error('请先打开一个文件夹');
    }

    const filePath = `${currentFolder}\\${fileName}`;
    try {
      await writeTextFile(filePath, content);
      // 刷新文件树
      await refreshFolder();
      return filePath;
    } catch (error) {
      console.error('创建文件失败:', error);
      throw error;
    }
  }, [currentFolder, refreshFolder]);

  // 插入图片
  const insertImage = useCallback(async (imagePath: string): Promise<string> => {
    if (!currentFolder) {
      throw new Error('请先打开一个文件夹');
    }

    try {
      const fileName = imagePath.split(/[\\/]/).pop() || 'image.png';
      const targetPath = `${currentFolder}\\${fileName}`;
      
      // 复制图片到当前文件夹
      await copyFile(imagePath, targetPath);
      
      // 刷新文件树
      await refreshFolder();
      
      // 返回相对路径用于Markdown引用
      return fileName;
    } catch (error) {
      console.error('插入图片失败:', error);
      throw error;
    }
  }, [currentFolder, refreshFolder]);

  // 切换文件夹展开/折叠状态
  const toggleFolder = useCallback(async (node: FileNode) => {
    if (node.type !== 'directory') return;
    
    // 如果是首次展开且没有子节点，则加载子节点
    if (!node.isExpanded && (!node.children || node.children.length === 0)) {
      try {
        console.log('加载子目录:', node.path);
        const childNodes = await buildFileTree(node.path);
        
        setFileTree(prevTree => {
          const updateNode = (nodes: FileNode[]): FileNode[] => {
            return nodes.map(n => {
              if (n.path === node.path) {
                return { 
                  ...n, 
                  isExpanded: true,
                  children: childNodes 
                };
              }
              if (n.children) {
                return { ...n, children: updateNode(n.children) };
              }
              return n;
            });
          };
          
          return updateNode(prevTree);
        });
      } catch (error) {
        console.error('加载子目录失败:', error);
      }
    } else {
      // 仅切换展开/折叠状态
      setFileTree(prevTree => {
        const updateNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(n => {
            if (n.path === node.path) {
              return { ...n, isExpanded: !n.isExpanded };
            }
            if (n.children) {
              return { ...n, children: updateNode(n.children) };
            }
            return n;
          });
        };
        
        return updateNode(prevTree);
      });
    }
  }, [buildFileTree]);

  return {
    currentFolder,
    fileTree,
    isLoading,
    openFolder,
    refreshFolder,
    openFile,
    saveFile,
    createFile,
    insertImage,
    toggleFolder
  };
};
