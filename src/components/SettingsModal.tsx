import React, { useState } from 'react';
import { X, FolderOpen, Download, FileText, Monitor } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, saveSettings, setCustomPath, getCustomPath, selectFolder } = useSettings();
  const [customPath, setCustomPathValue] = useState(getCustomPath());

  if (!isOpen) return null;

  const handleSaveLocationChange = (location: string) => {
    saveSettings({ defaultSaveLocation: location });
  };

  const handleCustomPathChange = (path: string) => {
    setCustomPathValue(path);
    setCustomPath(path);
  };

  const handleBrowseCustomPath = async () => {
    try {
      console.log('开始选择文件夹...');
      const selectedPath = await selectFolder();
      console.log('选择的路径:', selectedPath);
      if (selectedPath) {
        setCustomPathValue(selectedPath);
        handleCustomPathChange(selectedPath);
        console.log('文件夹选择成功:', selectedPath);
      } else {
        console.log('用户取消了文件夹选择');
      }
    } catch (error) {
      console.error('选择文件夹失败:', error);
      alert(`选择文件夹失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };


  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>设置</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <h3>默认保存位置</h3>
            <div className="save-location-options">
              <label className="location-option">
                <input
                  type="radio"
                  name="saveLocation"
                  value="downloads"
                  checked={settings.defaultSaveLocation === 'downloads'}
                  onChange={(e) => handleSaveLocationChange(e.target.value)}
                />
                <Download size={16} />
                <span>下载文件夹</span>
              </label>

              <label className="location-option">
                <input
                  type="radio"
                  name="saveLocation"
                  value="documents"
                  checked={settings.defaultSaveLocation === 'documents'}
                  onChange={(e) => handleSaveLocationChange(e.target.value)}
                />
                <FileText size={16} />
                <span>文档文件夹</span>
              </label>

              <label className="location-option">
                <input
                  type="radio"
                  name="saveLocation"
                  value="desktop"
                  checked={settings.defaultSaveLocation === 'desktop'}
                  onChange={(e) => handleSaveLocationChange(e.target.value)}
                />
                <Monitor size={16} />
                <span>桌面</span>
              </label>

              <label className="location-option">
                <input
                  type="radio"
                  name="saveLocation"
                  value="custom"
                  checked={settings.defaultSaveLocation === 'custom'}
                  onChange={(e) => handleSaveLocationChange(e.target.value)}
                />
                <FolderOpen size={16} />
                <span>自定义路径</span>
              </label>
            </div>

            {settings.defaultSaveLocation === 'custom' && (
              <div className="custom-path-section">
                <div className="path-input-group">
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPathValue(e.target.value)}
                    placeholder="请输入自定义路径"
                    className="path-input"
                  />
                  <button onClick={handleBrowseCustomPath} className="browse-btn">
                    <FolderOpen size={16} />
                    浏览
                  </button>
                </div>
                <p className="path-hint">
                  提示：选择自定义文件夹后，文件将保存到您选择的文件夹中
                </p>
              </div>
            )}
          </div>

          <div className="setting-group">
            <h3>其他设置</h3>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => saveSettings({ autoSave: e.target.checked })}
              />
              <span>自动保存</span>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="save-btn" onClick={onClose}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
