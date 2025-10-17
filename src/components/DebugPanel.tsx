import React, { useState, useEffect } from 'react';
import { X, Copy, Trash2 } from 'lucide-react';
import './DebugPanel.css';

interface DebugLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  data?: any;
}

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  // 监听控制台日志
  useEffect(() => {
    if (!isOpen) return;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (level: DebugLog['level'], args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const newLog: DebugLog = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        data: args.length > 1 ? args : undefined
      };

      setLogs(prev => {
        const newLogs = [...prev, newLog];
        // 限制日志数量，避免内存问题
        return newLogs.slice(-100);
      });
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('info', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [isOpen]);

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll) {
      const panel = document.getElementById('debug-panel-content');
      if (panel) {
        panel.scrollTop = panel.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      alert('日志已复制到剪贴板');
    }).catch(() => {
      alert('复制失败，请手动选择文本');
    });
  };

  const getLogIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return '📝';
    }
  };

  const getLogClass = (level: DebugLog['level']) => {
    switch (level) {
      case 'info': return 'debug-log-info';
      case 'warn': return 'debug-log-warn';
      case 'error': return 'debug-log-error';
      case 'success': return 'debug-log-success';
      default: return 'debug-log-info';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="debug-panel-overlay">
      <div className="debug-panel">
        <div className="debug-panel-header">
          <h3>🔍 调试面板</h3>
          <div className="debug-panel-controls">
            <label className="debug-auto-scroll">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              自动滚动
            </label>
            <button onClick={copyLogs} title="复制日志">
              <Copy size={16} />
            </button>
            <button onClick={clearLogs} title="清空日志">
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} title="关闭">
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="debug-panel-content" id="debug-panel-content">
          {logs.length === 0 ? (
            <div className="debug-empty">
              <p>📝 暂无日志</p>
              <p>请尝试打开文件夹或执行其他操作</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className={`debug-log ${getLogClass(log.level)}`}>
                <div className="debug-log-header">
                  <span className="debug-log-icon">{getLogIcon(log.level)}</span>
                  <span className="debug-log-time">{log.timestamp}</span>
                  <span className="debug-log-level">{log.level.toUpperCase()}</span>
                </div>
                <div className="debug-log-message">{log.message}</div>
                {log.data && (
                  <details className="debug-log-details">
                    <summary>详细信息</summary>
                    <pre>{JSON.stringify(log.data, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="debug-panel-footer">
          <span>日志数量: {logs.length}</span>
          <span>最后更新: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
