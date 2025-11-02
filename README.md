# Next Desktop 项目

## 启动项目

```bash
pnpm install
pnpm run dev     # 浏览器启动项目
pnpm start       # Electron启动项目
```

## 桌面结构

1. **Header**：顶部导航栏 - 用于打开窗口
2. **WindowManager**：窗口管理器 - 用于管理、渲染窗口（内容存放在 apps 目录下）
3. **UnitManager**：组件管理器 - 用于管理、渲染组件（内容存放在 units 目录下）
4. **MouseMenu**：鼠标菜单 - 暂时不知道有什么用（


## Apps 应用

使用 Window 显示，具有标题栏、控制栏、配色方案：

1. **FilesView**：文件视图窗口 - 用于显示文件列表（暂时显示硬编码内容）
2. **Info**：信息视图窗口 - 用于显示系统信息
3. **Time**：时间视图窗口 - 用于显示当前时间
4. **Settings**：设置视图窗口 - 用于显示设置选项
5. **UnitManager**：组件管理器 - 用于管理组件
6. **Store**：Unit商店 - 打算提供各种有意思的桌面小组件

## Unit 组件

使用 Unit 显示，没有标题栏、控制栏、配色方案，内容由 Unit 组件自定义。按住 Ctrl 拖动可以移动 Unit：

1. **Time**：时间组件 - 用于显示当前时间