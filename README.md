# 公式引擎网页版

这是一个基于Vue 3和Vite的公式引擎Web应用程序，允许用户创建、编辑和管理自定义公式和运算符。该应用程序提供了一个直观的用户界面，用于构建复杂的嵌套运算表达式，支持多层级嵌套的运算符结构。

## 特性

- **自定义公式管理**：创建、编辑、删除和管理公式库
- **自定义运算符系统**：定义自己的运算符及其行为
- **递归嵌套支持**：支持任意层级的运算符嵌套，构建复杂表达式
- **实时计算引擎**：即时验证和计算表达式结果
- **变量管理**：动态添加和管理表达式中使用的变量
- **美观的用户界面**：基于Element Plus的现代化UI设计
- **交互式编辑器**：直观的表达式编辑体验
- **计算步骤展示**：显示详细的计算过程

## 技术栈

- **前端框架**：Vue 3（组合式API）
- **构建工具**：Vite
- **UI组件库**：Element Plus
- **路由管理**：Vue Router
- **HTTP客户端**：Axios
- **状态管理**：Vue 3 Reactive API

## 安装

克隆仓库后，可以使用以下命令安装依赖并运行项目：

```bash
# 克隆仓库
git clone https://github.com/JunVYOUNG/FormulaEngineWeb.git
cd FormulaEngineWeb

# 安装依赖
npm install

# 开发模式启动服务
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

项目主要包含以下几个模块：

- **Dashboard** - 应用程序首页和概览
- **Formulas** - 公式管理页面，用于创建和管理公式库
- **Operators** - 自定义运算符管理页面，定义运算符及其行为 
- **Calculator** - 公式计算器和编辑器，支持多层级嵌套运算表达式

主要组件：

- **ExpressionEditor** - 核心表达式编辑器组件，支持运算符嵌套

## 使用说明

### 创建自定义运算符
1. 导航至"运算符"页面
2. 点击"新建运算符"按钮
3. 填写运算符名称、参数和实现逻辑
4. 保存运算符

### 使用公式计算器
1. 导航至"计算器"页面
2. 从运算符列表中选择所需运算符
3. 设置运算符参数（支持值、变量或嵌套运算符）
4. 对于嵌套运算符，可以点击"设置参数"按钮进行递归参数设置
5. 确认参数设置后，公式将显示在编辑区域
6. 添加需要的变量和值
7. 点击"计算"按钮查看结果

## 部署到GitHub

### 创建GitHub仓库
1. 在GitHub上创建新仓库
2. 初始化本地Git仓库（如果尚未初始化）
```bash
git init
git add .
git commit -m "初始提交"
```
3. 添加远程仓库并推送
```bash
git remote add origin https://github.com/JunVYOUNG/FormulaEngineWeb.git
git push -u origin main
```

## 贡献

欢迎通过Pull Request或Issue贡献代码或提出建议。提交代码前请确保：

1. 代码符合项目的编码规范
2. 已添加必要的测试
3. 文档已更新

## 许可证

本项目采用[MIT](LICENSE)许可证。详细信息请参阅LICENSE文件。
