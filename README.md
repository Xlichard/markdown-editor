# Markdown编辑器

一个基于 Tauri + React + TypeScript 构建的现代化 Markdown 编辑器，提供丰富的编辑功能和优雅的用户体验。

## ✨ 项目亮点

- 🚀 **跨平台桌面应用** - 基于 Tauri 框架，性能优异，体积小巧
- 📝 **实时预览** - 支持 Markdown 实时渲染和预览模式切换
- 🎨 **现代化界面** - 响应式设计，支持深色/浅色主题切换
- 📁 **文件管理** - 完整的文件树浏览、打开、保存功能
- 🔧 **丰富功能** - 大纲导航、设置面板、调试工具等
- 💾 **本地存储** - 所有数据本地保存，保护隐私安全
- 🛠️ **开发友好** - 完整的开发工具链和脚本支持

## 🛠️ 技术栈

### 前端技术
- **React 19** - 现代化的用户界面框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 快速的构建工具和开发服务器
- **@uiw/react-md-editor** - 功能丰富的 Markdown 编辑器组件
- **Lucide React** - 精美的图标库
- **CSS3** - 现代化的样式设计

### 后端技术
- **Tauri 2** - 使用 Rust 构建的跨平台桌面应用框架
- **Rust** - 系统级编程语言，提供高性能和内存安全
- **Tauri API** - 文件系统、对话框等原生功能集成

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Git** - 版本控制

## 📁 项目结构

```
markdown-editor/
├── src/                          # 前端源码
│   ├── components/               # React 组件
│   │   ├── MarkdownEditor.tsx   # 主编辑器组件
│   │   ├── Sidebar.tsx          # 侧边栏组件
│   │   ├── FileTree.tsx         # 文件树组件
│   │   ├── SettingsModal.tsx    # 设置面板
│   │   ├── EditDropdown.tsx     # 编辑下拉菜单
│   │   ├── Outline.tsx          # 大纲导航
│   │   └── DebugPanel.tsx       # 调试面板
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useFileOperations.ts # 文件操作逻辑
│   │   ├── useEditorOperations.ts # 编辑器操作逻辑
│   │   ├── useFolderManager.ts  # 文件夹管理
│   │   ├── useSettings.ts       # 设置管理
│   │   └── useTheme.ts          # 主题管理
│   ├── assets/                  # 静态资源
│   ├── App.tsx                  # 应用入口
│   └── main.tsx                 # 应用启动
├── src-tauri/                   # Tauri 后端源码
│   ├── src/                     # Rust 源码
│   ├── Cargo.toml              # Rust 依赖配置
│   ├── tauri.conf.json         # Tauri 应用配置
│   └── target/                 # 编译输出目录
├── dist/                        # 前端构建输出
├── public/                      # 公共静态文件
├── package.json                 # Node.js 依赖配置
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── 清理依赖.bat                 # 依赖清理脚本
├── 恢复依赖.bat                 # 依赖恢复脚本
└── README.md                   # 项目说明文档
```

## 🚀 快速上手

### 环境要求

- **Node.js** >= 18.0.0
- **Rust** >= 1.70.0
- **Git** (可选，用于版本控制)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd markdown-editor

# 安装 Node.js 依赖
npm install

# 安装 Rust 依赖 (会自动执行)
npm run tauri dev
```

### 开发模式

```bash
# 启动前端开发服务器 (仅前端)
npm run dev

# 启动 Tauri 开发模式 (推荐)
npm run tauri dev
```

### 构建应用

```bash
# 构建前端
npm run build

# 构建桌面应用
npm run tauri build
```

构建完成后，可执行文件位于：
- `src-tauri/target/release/markdown-editor.exe` (主程序)
- `src-tauri/target/release/bundle/nsis/Markdown编辑器_0.1.0_x64-setup.exe` (安装包)

## 📋 主要功能

### 编辑器功能
- ✅ **实时预览** - Markdown 语法高亮和实时渲染
- ✅ **双栏模式** - 编辑器和预览同时显示
- ✅ **全屏预览** - 专注阅读模式
- ✅ **语法高亮** - 代码块语法高亮支持
- ✅ **GFM 支持** - GitHub Flavored Markdown 扩展

### 文件管理
- ✅ **文件树浏览** - 可视化文件夹结构
- ✅ **文件操作** - 新建、打开、保存、另存为
- ✅ **文件夹管理** - 创建、删除、重命名文件夹
- ✅ **文件关联** - 支持 .md 文件关联

### 界面功能
- ✅ **主题切换** - 深色/浅色主题
- ✅ **侧边栏** - 可调整宽度的文件树侧边栏
- ✅ **大纲导航** - 文档结构快速导航
- ✅ **设置面板** - 个性化配置选项
- ✅ **调试工具** - 开发调试信息面板

## 🧹 依赖管理脚本

### 清理依赖脚本 (`清理依赖.bat`)

用于清理项目中的依赖文件，节省磁盘空间：

**删除内容：**
- `node_modules/` - Node.js 依赖包 (通常几十到几百MB)
- `package-lock.json` - npm 依赖锁定文件
- `src-tauri/target/` - Rust 编译缓存 (通常几百MB到几GB)
- `src-tauri/Cargo.lock` - Rust 依赖锁定文件

**保留内容：**
- 所有源码文件 (`src/`, `src-tauri/src/`)
- 配置文件 (`package.json`, `Cargo.toml`, `vite.config.ts` 等)
- 编译产物 (`dist/`, 可执行文件)

**使用场景：**
- 项目开发完成后，需要节省磁盘空间
- 将项目分享给他人，减少传输大小
- 长期存储项目，只保留核心文件

### 恢复依赖脚本 (`恢复依赖.bat`)

用于重新安装所有依赖，恢复开发环境：

**执行步骤：**
1. 检查 Node.js 和 Rust 环境
2. 验证必要配置文件存在
3. 运行 `npm install` 安装前端依赖
4. 运行 `cargo build` 安装 Rust 依赖
5. 恢复完整的开发环境

**使用场景：**
- 清理依赖后需要重新开发
- 在新环境中设置项目
- 依赖出现问题需要重新安装

**使用方法：**
```bash
# 双击运行脚本，或在命令行中执行
./恢复依赖.bat
```

## 🎯 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动前端开发服务器 (http://localhost:5173) |
| `npm run build` | 构建前端生产版本 |
| `npm run preview` | 预览构建后的前端应用 |
| `npm run tauri dev` | 启动 Tauri 开发模式 |
| `npm run tauri build` | 构建桌面应用 |

## 🔧 配置说明

### Tauri 配置 (`src-tauri/tauri.conf.json`)
- 应用名称：Markdown编辑器
- 窗口大小：1200x800 (最小 800x600)
- 打包格式：NSIS 安装包
- 图标：多尺寸图标支持

### Vite 配置 (`vite.config.ts`)
- 开发服务器端口：5173
- 构建输出目录：dist
- React 插件集成

## 📝 开发说明

### 组件架构
- **MarkdownEditor** - 主编辑器组件，集成所有功能
- **Sidebar** - 侧边栏组件，包含文件树和设置
- **FileTree** - 文件树组件，处理文件浏览
- **SettingsModal** - 设置面板，管理应用配置

### 自定义 Hooks
- **useFileOperations** - 文件操作逻辑封装
- **useEditorOperations** - 编辑器操作逻辑
- **useFolderManager** - 文件夹管理逻辑
- **useSettings** - 设置状态管理
- **useTheme** - 主题切换逻辑

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面库
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) - Markdown 编辑器组件
- [Lucide](https://lucide.dev/) - 图标库

---

**享受编写 Markdown 的乐趣！** ✨
