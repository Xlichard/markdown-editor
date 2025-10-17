const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 开始编译 Markdown 编辑器...');

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`执行: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`命令执行失败，退出码: ${code}`));
      }
    });
  });
}

async function build() {
  try {
    const projectDir = __dirname;
    
    console.log('📦 安装依赖...');
    await runCommand('npm', ['install'], projectDir);
    
    console.log('🔨 构建前端...');
    await runCommand('npm', ['run', 'build'], projectDir);
    
    console.log('📱 构建 Tauri 应用...');
    await runCommand('npm', ['run', 'tauri', 'build'], projectDir);
    
    console.log('✅ 编译完成！');
    console.log('📁 可执行文件位置: src-tauri/target/release/markdown-editor.exe');
    console.log('📦 安装包位置: src-tauri/target/release/bundle/nsis/Markdown编辑器_0.1.0_x64-setup.exe');
    
  } catch (error) {
    console.error('❌ 编译失败:', error.message);
    process.exit(1);
  }
}

build();
