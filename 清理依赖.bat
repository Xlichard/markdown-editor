chcp 65001


@echo off
echo 正在清理项目依赖，保留源码和可执行文件...
echo.

REM 删除Node.js依赖
if exist "node_modules" (
    echo 删除 node_modules 目录...
    rmdir /s /q "node_modules"
    echo ✓ node_modules 已删除
) else (
    echo - node_modules 不存在
)

if exist "package-lock.json" (
    echo 删除 package-lock.json...
    del "package-lock.json"
    echo ✓ package-lock.json 已删除
) else (
    echo - package-lock.json 不存在
)

REM 删除Rust编译缓存
if exist "src-tauri\target" (
    echo 删除 Rust 编译缓存...
    rmdir /s /q "src-tauri\target"
    echo ✓ Rust 编译缓存已删除
) else (
    echo - Rust 编译缓存不存在
)

if exist "src-tauri\Cargo.lock" (
    echo 删除 Cargo.lock...
    del "src-tauri\Cargo.lock"
    echo ✓ Cargo.lock 已删除
) else (
    echo - Cargo.lock 不存在
)

echo.
echo ========================================
echo 清理完成！
echo.
echo 保留的文件：
echo - 源码文件 (src/, src-tauri/src/)
echo - 配置文件 (package.json, Cargo.toml, 等)
echo - 编译产物 (dist/, 可执行文件)
echo.
echo 如需重新开发，请运行 "恢复依赖.bat"
echo ========================================
pause
