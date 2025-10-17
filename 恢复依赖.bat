chcp 65001

@echo off
echo 正在恢复项目依赖，准备开发环境...
echo.

REM 检查必要文件是否存在
if not exist "package.json" (
    echo 错误：package.json 不存在！
    echo 请确保在正确的项目目录中运行此脚本。
    pause
    exit /b 1
)

if not exist "src-tauri\Cargo.toml" (
    echo 错误：src-tauri\Cargo.toml 不存在！
    echo 请确保在正确的项目目录中运行此脚本。
    pause
    exit /b 1
)

echo 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到 Node.js！
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js 已安装
)

echo 检查 Rust 环境...
cargo --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到 Rust！
    echo 请先安装 Rust: https://rustup.rs/
    pause
    exit /b 1
) else (
    echo ✓ Rust 已安装
)

echo.
echo 安装 Node.js 依赖...
npm install
if errorlevel 1 (
    echo 错误：npm install 失败！
    pause
    exit /b 1
) else (
    echo ✓ Node.js 依赖安装完成
)

echo.
echo 安装 Rust 依赖...
cd src-tauri
cargo build
if errorlevel 1 (
    echo 错误：Rust 依赖安装失败！
    cd ..
    pause
    exit /b 1
) else (
    echo ✓ Rust 依赖安装完成
)
cd ..

echo.
echo ========================================
echo 依赖恢复完成！
echo.
echo 现在可以运行以下命令：
echo - npm run dev        (开发模式)
echo - npm run build      (构建前端)
echo - npm run tauri dev  (Tauri开发模式)
echo - npm run tauri build (构建应用)
echo ========================================
pause
