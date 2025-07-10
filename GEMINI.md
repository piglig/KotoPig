# GEMINI 项目配置: KotoPig

本文档旨在提供项目专属的指南和配置，以确保 AI 辅助开发能够遵循项目既有的代码结构、开发约定和总体目标。

## 1. 项目概述

KotoPig 是一个为日语学习者设计的，用于学习和练习动词变化的 Web 应用。

- **前端:** 使用 **React** 构建的富交互用户界面，UI 采用 **Material-UI (MUI)**。
- **后端/数据处理:** 使用 **Python** 脚本集，用于抓取动词数据、处理词典文件以及利用AI生成内容。

项目的核心目标是提供一个引人入胜且高效的学习体验。

## 2. 前端开发 (React & Material-UI)

前端是一个标准的 [Create React App](https://create-react-app.dev/) 项目。

- **包管理器:** 请使用 `npm` 进行所有依赖管理。
- **核心库与框架:**
    - **React:** 核心视图库。
    - **React Router (`react-router-dom`):** 用于页面导航和路由。
    - **Material-UI (MUI):** 用于 UI 样式。
    - **Framer Motion:** 用于实现动画效果。
    - **Lottie:** 用于实现后置动画效果。
- **代码风格:**
    - **React:** 请遵循项目现有的代码风格，该风格基于标准的 React 约定和项目的 ESLint 配置 (`react-app`, `react-app/jest`)。
    - **Material-UI (MUI):** 遵循 MUI 的组件使用和样式约定。
- **目录结构:**
    - `src/components`: 可复用的 UI 组件。
    - `src/pages`: 与路由对应的顶层页面组件。
    - `src/contexts`: 用于状态管理的 React Context。
    - `src/data`: 应用使用的静态数据文件。

### 主要命令

- **启动开发服务器:**
  ```bash
  npm start
  ```
- **运行测试:**
  ```bash
  npm test
  ```
- **构建生产版本:**
  ```bash
  npm run build
  ```
- **部署到 GitHub Pages:**
  ```bash
  npm run deploy
  ```

## 3. 后端开发 (Python)

项目根目录中的 Python 脚本用于数据采集和处理。

- **用途:**
    - `conjugation_scraper.py`, `advanced_scraper.py`: 从网络来源抓取动词数据。
    - `jmdict_processor.py`: 处理 JMDict 词典文件。
    - `google_ai_code_pipeline.py`: 使用 Gemini API 完成代码生成任务。
- **依赖:** 主要依赖库包括 `google-generativeai`, `python-dotenv`, `beautifulsoup4`, `requests`。
- **环境:**
    - API 密钥和其他敏感信息通过 `.env` 文件进行管理。请确保为 AI 相关的脚本配置 `GOOGLE_API_KEY`。
- **执行:**
  直接使用 Python 3 运行脚本。
  ```bash
  python <script_name>.py
  ```

## 4. 通用指南

- **代码提交:** 编写清晰、简洁的提交信息，重点说明做出变更的“原因”。
- **新功能:** 添加新组件或功能时，请遵循现有的架构模式，并在合适的目录（如 `src/components`, `src/pages`）中创建文件。
- **依赖管理:** 若无充分理由，请勿添加新的库。
- **代码风格:** 始终保持代码格式、命名约定和注释风格与周边代码一致。

## 5. 文档与资源获取

为了高效地解决问题和获取信息，请遵循以下策略。

### Agent 配置

- **主要信息源:** 项目的本地文件是最高级别的权威信息源。在进行任何修改或添加之前，请务必分析现有代码、组件和样式。
- **环境配置:** 所有的环境特定配置（如API密钥）都应通过 `.env` 文件加载。请勿在代码中硬编码任何敏感信息。
- **工具使用:**
    - 使用 `list_directory` 和 `read_file` / `read_many_files` 来探索和理解项目结构。
    - 使用 `search_file_content` 来定位具体的函数或组件实现。

### 搜索策略

当需要外部信息时，请按以下优先级进行搜索：

1.  **官方文档优先:**
    - **React:** [react.dev](https://react.dev/)
    - **Material-UI (MUI):** [mui.com](https://mui.com/)
    - **Python:** [docs.python.org](https://docs.python.org/3/)
    - **Google Generative AI:** [ai.google.dev/docs](https://ai.google.dev/docs)

2.  **精确搜索查询:**
    - 使用 `google_web_search` 工具时，构建精确的查询。
    - **示例:**
        - "react useEffect hook dependency array"
        - "material-ui grid layout example"
        - "python requests post json example"

3.  **社区资源:**
    - 对于疑难问题，可以参考 Stack Overflow 或相关的 GitHub issue 讨论，但官方文档应始终是首选。在采纳社区方案时，要审慎评估其是否符合本项目的编码规范和技术栈。