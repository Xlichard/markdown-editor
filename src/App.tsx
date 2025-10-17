import MarkdownEditor from './components/MarkdownEditor';
import SimpleTest from './components/SimpleTest';
import './App.css';

function App() {
  // 使用完整的Markdown编辑器功能
  const useSimpleTest = false; // 设置为true来使用简单测试，false来使用完整功能
  
  return (
    <div className="app">
      {useSimpleTest ? <SimpleTest /> : <MarkdownEditor />}
    </div>
  );
}

export default App;
