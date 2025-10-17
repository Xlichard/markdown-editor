import React from 'react';
import './Outline.css';

interface OutlineItem {
  level: number;
  text: string;
  id: string;
}

interface OutlineProps {
  content: string;
  onItemClick?: (item: OutlineItem) => void;
}

const Outline: React.FC<OutlineProps> = ({ content, onItemClick }) => {
  // 解析Markdown内容，提取标题
  const parseOutline = (markdown: string): OutlineItem[] => {
    const lines = markdown.split('\n');
    const outline: OutlineItem[] = [];
    
    lines.forEach((line, index) => {
      // 匹配标题行 (# ## ### 等)
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2].trim();
        const id = `heading-${index}`;
        
        outline.push({
          level,
          text,
          id
        });
      }
    });
    
    return outline;
  };

  const outlineItems = parseOutline(content);

  const handleItemClick = (item: OutlineItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const getHeadingIcon = (level: number) => {
    // 根据标题级别返回不同的图标或样式
    return <span className={`heading-level level-${level}`}></span>;
  };

  const getIndentStyle = (level: number) => {
    return {
      paddingLeft: `${(level - 1) * 16 + 8}px`
    };
  };

  if (outlineItems.length === 0) {
    return (
      <div className="outline">
        <div className="outline-empty">
          <p>当前文档没有标题</p>
          <p className="outline-hint">使用 # ## ### 等标记来创建标题</p>
        </div>
      </div>
    );
  }

  return (
    <div className="outline">
      <div className="outline-header">
        <span>文档大纲</span>
        <span className="outline-count">{outlineItems.length} 个标题</span>
      </div>
      <div className="outline-list">
        {outlineItems.map((item, index) => (
          <div
            key={index}
            className={`outline-item level-${item.level}`}
            style={getIndentStyle(item.level)}
            onClick={() => handleItemClick(item)}
            title={item.text}
          >
            <span className="outline-icon">
              {getHeadingIcon(item.level)}
            </span>
            <span className="outline-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outline;
