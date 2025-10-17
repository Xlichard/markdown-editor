import { useState, useCallback } from 'react';

export interface EditorOperations {
  // 撤销/重做
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // 剪贴板操作
  copy: () => void;
  paste: () => void;
  cut: () => void;
  
  // 选择操作
  selectAll: () => void;
  
  // 历史记录管理
  saveHistory: (content: string) => void;
  clearHistory: () => void;
}

export const useEditorOperations = (
  content: string,
  setContent: (content: string) => void,
  editorRef: React.RefObject<any>
): EditorOperations => {
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const maxHistorySize = 50;

  // 保存历史记录
  const saveHistory = useCallback((newContent: string) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), newContent];
      // 限制历史记录大小
      if (newHistory.length > maxHistorySize) {
        return newHistory.slice(-maxHistorySize);
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [historyIndex]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history, setContent]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history, setContent]);

  // 复制
  const copy = useCallback(() => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      if (textarea) {
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).catch(err => {
            console.error('复制失败:', err);
            // 降级方案
            document.execCommand('copy');
          });
        }
      }
    }
  }, [editorRef]);

  // 粘贴
  const paste = useCallback(async () => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      if (textarea) {
        try {
          // 首先尝试读取剪贴板中的图片
          const clipboardItems = await navigator.clipboard.read();
          
          for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
              if (type.startsWith('image/')) {
                // 处理图片粘贴
                const blob = await clipboardItem.getType(type);
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageDataUrl = e.target?.result as string;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const imageMarkdown = `![粘贴的图片](${imageDataUrl})`;
                  const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
                  setContent(newContent);
                  saveHistory(newContent);
                  
                  // 设置光标位置
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                    textarea.focus();
                  }, 0);
                };
                reader.readAsDataURL(blob);
                return;
              }
            }
          }
          
          // 如果没有图片，尝试粘贴文本
          const text = await navigator.clipboard.readText();
          if (text) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + text + content.substring(end);
            setContent(newContent);
            saveHistory(newContent);
            
            // 设置光标位置
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + text.length;
              textarea.focus();
            }, 0);
          }
        } catch (err) {
          console.error('粘贴失败:', err);
          // 降级方案
          try {
            document.execCommand('paste');
          } catch (fallbackErr) {
            console.error('降级粘贴也失败:', fallbackErr);
          }
        }
      }
    }
  }, [content, setContent, saveHistory, editorRef]);

  // 剪切
  const cut = useCallback(() => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      if (textarea) {
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).catch(err => {
            console.error('复制失败:', err);
          });
          
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = content.substring(0, start) + content.substring(end);
          setContent(newContent);
          saveHistory(newContent);
          
          // 设置光标位置
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start;
            textarea.focus();
          }, 0);
        }
      }
    }
  }, [content, setContent, saveHistory, editorRef]);

  // 全选
  const selectAll = useCallback(() => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      if (textarea) {
        textarea.select();
        textarea.focus();
      }
    }
  }, [editorRef]);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([content]);
    setHistoryIndex(0);
  }, [content]);

  return {
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    copy,
    paste,
    cut,
    selectAll,
    saveHistory,
    clearHistory
  };
};
