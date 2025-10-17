import { useState, useEffect, useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

export interface AppSettings {
  defaultSaveLocation: string;
  autoSave: boolean;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultSaveLocation: 'downloads', // 'downloads' | 'documents' | 'desktop' | 'custom'
  autoSave: false,
  theme: 'light'
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('markdown-editor-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('加载设置失败:', error);
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存设置
  const saveSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    console.log('保存设置:', updatedSettings);
    setSettings(updatedSettings);
    localStorage.setItem('markdown-editor-settings', JSON.stringify(updatedSettings));
    console.log('设置已保存到localStorage');
  }, [settings]);

  // 获取保存路径
  const getSavePath = useCallback(async (fileName: string) => {
    const { defaultSaveLocation } = settings;
    console.log('当前保存位置设置:', defaultSaveLocation);
    
    try {
      const dirs = await getUserDirs();
      console.log('获取到的用户目录:', dirs);
      
      let finalPath = '';
      switch (defaultSaveLocation) {
        case 'downloads':
          finalPath = `${dirs.downloads}\\${fileName}`;
          break;
        case 'documents':
          finalPath = `${dirs.documents}\\${fileName}`;
          break;
        case 'desktop':
          finalPath = `${dirs.desktop}\\${fileName}`;
          break;
        case 'custom':
          const customPath = localStorage.getItem('markdown-editor-custom-path') || dirs.downloads;
          console.log('自定义路径:', customPath);
          finalPath = `${customPath}\\${fileName}`;
          break;
        default:
          finalPath = `${dirs.downloads}\\${fileName}`;
      }
      
      console.log('最终保存路径:', finalPath);
      return finalPath;
    } catch (error) {
      console.error('获取保存路径失败:', error);
      // 回退到默认路径
      const fallbackPath = `${getDownloadsPath()}\\${fileName}`;
      console.log('使用回退路径:', fallbackPath);
      return fallbackPath;
    }
  }, [settings]);

  // 设置自定义路径
  const setCustomPath = useCallback((path: string) => {
    localStorage.setItem('markdown-editor-custom-path', path);
  }, []);

  // 获取自定义路径
  const getCustomPath = useCallback(() => {
    return localStorage.getItem('markdown-editor-custom-path') || getDownloadsPath();
  }, []);

  // 选择文件夹
  const selectFolder = useCallback(async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false
      });

      if (selectedPath && typeof selectedPath === 'string') {
        setCustomPath(selectedPath);
        return selectedPath;
      }
      return null;
    } catch (error) {
      console.error('选择文件夹失败:', error);
      throw error;
    }
  }, [setCustomPath]);

  return {
    settings,
    isLoaded,
    saveSettings,
    getSavePath,
    setCustomPath,
    getCustomPath,
    selectFolder
  };
};

// 获取系统路径的辅助函数
let userDirs: any = null;

async function getUserDirs() {
  if (userDirs) {
    console.log('使用缓存的用户目录:', userDirs);
    return userDirs;
  }
  
  try {
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      console.log('尝试调用 get_user_dirs 命令...');
      userDirs = await invoke('get_user_dirs');
      console.log('成功获取用户目录:', userDirs);
      return userDirs;
    } else {
      console.log('不在Tauri环境中，使用默认路径');
    }
  } catch (error) {
    console.error('获取用户目录失败:', error);
    console.log('将使用默认路径');
  }
  
  // 默认路径 - 使用更真实的路径
  userDirs = {
    home: 'C:\\Users\\User',
    downloads: 'C:\\Users\\User\\Downloads',
    documents: 'C:\\Users\\User\\Documents',
    desktop: 'C:\\Users\\User\\Desktop'
  };
  console.log('使用默认用户目录:', userDirs);
  return userDirs;
}

function getDownloadsPath(): string {
  return 'C:\\Users\\User\\Downloads'; // 临时返回，实际会在getSavePath中动态获取
}
