# 🚀 Markdown编辑器示例

欢迎使用这个轻量化的Markdown编辑器！这是一个功能强大的所见即所得编辑器。

## ✨ 功能特性

- **所见即所得编辑** - 实时预览Markdown内容
- **本地文件管理** - 支持打开、保存、另存为Markdown文件  
- **快捷键支持** - 常用操作的键盘快捷键
- **代码高亮** - 支持多种编程语言的语法高亮
- **表格支持** - 完整的表格渲染功能
- **简洁美观界面** - 现代化的用户界面设计

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + N` | 新建文件 |
| `Ctrl + O` | 打开文件 |
| `Ctrl + S` | 保存文件 |
| `Ctrl + Shift + S` | 另存为 |

## 💻 代码示例

### JavaScript
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

const user = "World";
console.log(greet(user));
```

### Python
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 计算前10个斐波那契数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

### CSS
```css
.markdown-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}
```

## 📝 列表示例

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
    - 子子项目 2.2.1
- 项目 3

### 有序列表
1. 第一步：安装依赖
2. 第二步：配置项目
3. 第三步：运行应用
4. 第四步：开始编写

### 任务列表
- [x] 创建项目结构
- [x] 实现基础编辑器
- [x] 添加文件操作功能
- [ ] 添加更多主题
- [ ] 支持插件系统

## 📊 表格示例

| 功能 | 状态 | 优先级 | 描述 |
|------|------|--------|------|
| 文件操作 | ✅ 完成 | 高 | 支持打开、保存、另存为 |
| 实时预览 | ✅ 完成 | 高 | 所见即所得编辑 |
| 代码高亮 | ✅ 完成 | 中 | 支持多种语言 |
| 快捷键 | ✅ 完成 | 中 | 常用操作快捷键 |
| 主题切换 | ❌ 未开始 | 低 | 支持明暗主题 |

## 💬 引用和强调

> 这是一个引用块。可以包含多行内容。
> 
> 引用块通常用于：
> - 引用他人的话
> - 突出重要信息
> - 添加注释说明

### 文本强调

- **粗体文本** - 用于强调重要内容
- *斜体文本* - 用于表示强调或引用
- ***粗斜体文本*** - 双重强调
- ~~删除线文本~~ - 表示已删除或过时内容
- `行内代码` - 用于表示代码或命令

## 🔗 链接和图片

- [访问GitHub](https://github.com)
- [Tauri官网](https://tauri.app)
- [React官网](https://react.dev)

## 📋 其他功能

### 分割线

---

### 数学公式（如果支持）

行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### 脚注

这是一个带有脚注的文本[^1]。

[^1]: 这是脚注的内容。

---

**🎉 享受编写Markdown的乐趣！**

> 提示：点击右上角的"预览模式"按钮可以切换到纯预览模式，点击"编辑模式"可以切换回编辑模式。
