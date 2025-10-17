import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeManager {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = (): ThemeManager => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 从localStorage读取保存的主题，默认为light
    const savedTheme = localStorage.getItem('markdown-editor-theme') as Theme;
    return savedTheme || 'light';
  });

  // 应用主题到document
  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  }, []);

  // 设置主题
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('markdown-editor-theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // 初始化时应用主题
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return {
    theme,
    toggleTheme,
    setTheme
  };
};
