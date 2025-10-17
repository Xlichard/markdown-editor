import React from 'react';

const SimpleTest: React.FC = () => {
  const handleTest = () => {
    console.log('🧪 简单测试开始');
    alert('简单测试成功！');
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🧪 简单测试</h1>
      <p>这是一个简化的测试版本，用于验证应用是否能正常运行。</p>
      <button 
        onClick={handleTest}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        运行测试
      </button>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>如果这个页面能正常显示，说明基本功能正常。</p>
        <p>如果点击按钮有反应，说明事件处理正常。</p>
      </div>
    </div>
  );
};

export default SimpleTest;
