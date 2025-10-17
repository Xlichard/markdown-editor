const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 开始编译 Markdown 编辑器...');

try {
  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('🔨 构建前端...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  
  console.log('📱 构建 Tauri 应用...');
  execSync('npm run tauri build', { stdio: 'inherit', cwd: __dirname });
  
  console.log('✅ 编译完成！可执行文件位于 src-tauri/target/release/');
} catch (error) {
  console.error('❌ 编译失败:', error.message);
  process.exit(1);
}
