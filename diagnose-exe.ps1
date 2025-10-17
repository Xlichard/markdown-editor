# EXE文件诊断工具 (PowerShell版本)
Write-Host "🔍 EXE文件诊断工具..." -ForegroundColor Green
Write-Host ""

# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到脚本目录
Set-Location $PSScriptRoot

Write-Host "📋 检查文件状态..." -ForegroundColor Yellow
$exePath = "src-tauri\target\release\markdown-editor.exe"

if (Test-Path $exePath) {
    Write-Host "✅ EXE文件存在" -ForegroundColor Green
    $fileInfo = Get-Item $exePath
    Write-Host "文件大小: $($fileInfo.Length) 字节" -ForegroundColor Cyan
    Write-Host "修改时间: $($fileInfo.LastWriteTime)" -ForegroundColor Cyan
    Write-Host "文件属性: $($fileInfo.Attributes)" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "🔍 检查文件完整性..." -ForegroundColor Yellow
    Write-Host "尝试获取文件版本信息..." -ForegroundColor Cyan
    try {
        $versionInfo = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($exePath)
        Write-Host "文件版本: $($versionInfo.FileVersion)" -ForegroundColor Cyan
        Write-Host "产品版本: $($versionInfo.ProductVersion)" -ForegroundColor Cyan
        Write-Host "公司名称: $($versionInfo.CompanyName)" -ForegroundColor Cyan
    } catch {
        Write-Host "无法获取版本信息: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🔍 检查依赖项..." -ForegroundColor Yellow
    Write-Host "检查.NET依赖项..." -ForegroundColor Cyan
    try {
        $assembly = [System.Reflection.Assembly]::LoadFrom($exePath)
        Write-Host "程序集加载成功" -ForegroundColor Green
    } catch {
        Write-Host "程序集加载失败: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🧪 尝试运行测试..." -ForegroundColor Yellow
    Write-Host "注意: 如果程序崩溃，请查看错误信息" -ForegroundColor Red
    $response = Read-Host "按回车键开始测试运行"
    
    Write-Host "启动程序..." -ForegroundColor Cyan
    try {
        $process = Start-Process -FilePath $exePath -PassThru
        Write-Host "程序已启动，进程ID: $($process.Id)" -ForegroundColor Green
        
        Write-Host "等待5秒..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        
        $runningProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
        if ($runningProcess) {
            Write-Host "✅ 程序正在运行" -ForegroundColor Green
            Write-Host "进程状态: $($runningProcess.Responding)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 程序已退出或崩溃" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ 启动程序失败: $_" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ EXE文件不存在" -ForegroundColor Red
    Write-Host "请先运行编译脚本" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 系统环境检查..." -ForegroundColor Yellow
Write-Host "Windows版本:" -ForegroundColor Cyan
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory

Write-Host ""
Write-Host "架构信息:" -ForegroundColor Cyan
Write-Host "处理器架构: $($env:PROCESSOR_ARCHITECTURE)" -ForegroundColor Cyan
Write-Host "系统架构: $([System.Environment]::Is64BitOperatingSystem)" -ForegroundColor Cyan

Write-Host ""
Write-Host "检查Visual C++ Redistributable..." -ForegroundColor Yellow
$vcRedist = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" -ErrorAction SilentlyContinue
if ($vcRedist) {
    Write-Host "✅ Visual C++ 2015-2022 Redistributable (x64) 已安装" -ForegroundColor Green
} else {
    Write-Host "❌ Visual C++ 2015-2022 Redistributable (x64) 未安装" -ForegroundColor Red
    Write-Host "请从Microsoft官网下载安装" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 权限检查..." -ForegroundColor Yellow
Write-Host "当前用户: $($env:USERNAME)" -ForegroundColor Cyan
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if ($isAdmin) {
    Write-Host "✅ 具有管理员权限" -ForegroundColor Green
} else {
    Write-Host "⚠️ 无管理员权限" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 故障排除建议:" -ForegroundColor Cyan
Write-Host "   1. 如果程序崩溃，检查Windows事件查看器" -ForegroundColor White
Write-Host "   2. 确保安装了Visual C++ Redistributable" -ForegroundColor White
Write-Host "   3. 检查杀毒软件是否阻止了程序" -ForegroundColor White
Write-Host "   4. 尝试以管理员身份运行" -ForegroundColor White
Write-Host "   5. 检查防火墙设置" -ForegroundColor White
Write-Host ""
Read-Host "按回车键退出"
