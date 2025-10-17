# 最小化编译脚本 (PowerShell版本)
Write-Host "🚀 最小化编译脚本..." -ForegroundColor Green
Write-Host "这个版本使用简化的测试组件，减少可能的错误源" -ForegroundColor Yellow
Write-Host ""

# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到脚本目录
Set-Location $PSScriptRoot
Write-Host "📋 当前目录: $(Get-Location)" -ForegroundColor Cyan

# 清理旧文件
Write-Host "🧹 清理旧文件..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "删除dist目录" -ForegroundColor Gray
}
if (Test-Path "src-tauri\target\release\markdown-editor.exe") {
    Remove-Item -Force "src-tauri\target\release\markdown-editor.exe"
    Write-Host "删除旧exe文件" -ForegroundColor Gray
}

# 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "依赖安装失败"
    }
    Write-Host "✅ 依赖安装成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 依赖安装失败: $_" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 构建前端
Write-Host "🔨 构建前端 (最小化版本)..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "前端构建失败"
    }
    Write-Host "✅ 前端构建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 前端构建失败: $_" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 构建Tauri应用
Write-Host "📱 构建 Tauri 应用..." -ForegroundColor Yellow
try {
    npm run tauri build
    if ($LASTEXITCODE -ne 0) {
        throw "Tauri构建失败"
    }
    Write-Host "✅ Tauri构建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ Tauri构建失败: $_" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查结果
Write-Host "🔍 检查结果..." -ForegroundColor Yellow
$exePath = "src-tauri\target\release\markdown-editor.exe"
if (Test-Path $exePath) {
    $fileInfo = Get-Item $exePath
    Write-Host "✅ EXE文件生成成功" -ForegroundColor Green
    Write-Host "文件大小: $($fileInfo.Length) 字节" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🧪 测试运行..." -ForegroundColor Yellow
    Write-Host "启动程序进行测试..." -ForegroundColor Cyan
    Start-Process $exePath
    
    Write-Host "等待3秒检查程序状态..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3
    
    $process = Get-Process -Name "markdown-editor" -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "✅ 程序运行正常" -ForegroundColor Green
    } else {
        Write-Host "❌ 程序可能崩溃了" -ForegroundColor Red
    }
} else {
    Write-Host "❌ EXE文件未生成" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 编译完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步:" -ForegroundColor Cyan
Write-Host "   1. 如果程序能运行，说明基本功能正常" -ForegroundColor White
Write-Host "   2. 然后可以修改App.tsx中的useSimpleTest为false" -ForegroundColor White
Write-Host "   3. 重新编译完整版本" -ForegroundColor White
Write-Host ""
Read-Host "按回车键退出"
