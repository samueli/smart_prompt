# Smart Prompt

Smart Prompt 是一个现代化的 AI 提示词管理工具，帮助用户更好地管理、优化和同步他们的 AI 提示词。通过 Chrome 扩展，用户可以轻松收集、管理和优化他们在各种 AI 平台上使用的提示词。

## 特性

- 🔍 一键收藏：轻松保存任何网页上的 AI 提示词
- ✨ 智能优化：基于大量数据分析，提供提示词优化建议
- ⚡ 实时同步：所有设备上的提示词保持同步
- 🌐 多语言支持：支持中文和英文界面
- 🎨 现代化界面：基于 Radix UI 和 Tailwind CSS 构建的美观界面
- 🔐 安全可靠：本地优先的数据存储策略

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 7.0 或更高版本

### 安装

1. 克隆项目：

\`\`\`bash
git clone https://github.com/samueli/smart-prompt.git
cd smart-prompt
\`\`\`

2. 安装依赖：

\`\`\`bash
npm install
\`\`\`

3. 启动开发服务器：

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:5173 查看应用。

### 构建

构建生产版本：

\`\`\`bash
npm run build
\`\`\`

预览生产构建：

\`\`\`bash
npm run preview
\`\`\`

## 浏览器扩展

Smart Prompt 提供了 Chrome 扩展来增强您的体验：

1. 从 Chrome 商店安装：
   - 访问 [Chrome Web Store](https://chrome.google.com/webstore/detail/cfegclkdkjgpclfahanfgejfjfmpkmjl)
   - 点击"添加到 Chrome"

2. 手动安装：
   - 下载最新版本的扩展包
   - 解压下载的文件
   - 在 Chrome 中访问 chrome://extensions/
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择解压后的文件夹

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式解决方案**: Tailwind CSS
- **UI 组件**: Radix UI
- **状态管理**: React Context
- **路由**: React Router
- **国际化**: i18next
- **图标**: Lucide React
- **部署**: Cloudflare Pages

## 开发指南

### 项目结构

\`\`\`
smart-prompt/
├── src/
│   ├── components/     # UI 组件
│   ├── contexts/       # React Context
│   ├── hooks/         # 自定义 Hooks
│   ├── i18n/          # 国际化文件
│   ├── lib/           # 工具函数
│   ├── pages/         # 页面组件
│   └── styles/        # 全局样式
├── public/            # 静态资源
└── vite.config.ts     # Vite 配置
\`\`\`

### 代码风格

项目使用 TypeScript 进行开发，确保代码类型安全。使用 ESLint 和 Prettier 保持代码风格一致。

### 国际化

使用 i18next 进行国际化，翻译文件位于 \`src/i18n/locales/\` 目录。

## 部署

项目使用 Cloudflare Pages 进行部署。运行以下命令部署到生产环境：

\`\`\`bash
npm run deploy
\`\`\`

## 反馈与支持

如果您有任何问题或建议，请通过以下方式联系我们：

- 发送邮件至 feedback@playwithai.fun
- 在 GitHub 上提交 Issue

## 许可证

[MIT License](LICENSE)

## 贡献指南

我们欢迎任何形式的贡献，包括但不限于：

- 提交 bug 报告
- 功能建议
- 代码贡献
- 文档改进

请确保在提交 Pull Request 之前：

1. 更新文档
2. 添加/更新测试
3. 确保所有测试通过
4. 遵循现有的代码风格

感谢所有为 Smart Prompt 做出贡献的开发者！
