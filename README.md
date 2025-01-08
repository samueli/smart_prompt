# Smart Prompt

[中文文档](README.zh-CN.md)

Smart Prompt is a modern AI prompt management tool that helps users better manage, optimize, and synchronize their AI prompts. Through the Chrome extension, users can easily collect, manage, and optimize prompts they use across various AI platforms.

## Features

- 🔍 One-Click Collection: Easily save AI prompts from any webpage
- ✨ Smart Optimization: Provide prompt optimization suggestions based on extensive data analysis
- ⚡ Real-time Sync: Keep prompts synchronized across all devices
- 🌐 Multi-language Support: English and Chinese interfaces available
- 🎨 Modern Interface: Beautiful UI built with Radix UI and Tailwind CSS
- 🔐 Secure & Reliable: Local-first data storage strategy

## Quick Start

### Requirements

- Node.js 18.0 or higher
- npm 7.0 or higher

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/samueli/smart-prompt.git
cd smart-prompt
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:5173 to view the application.

### Build

Build for production:

\`\`\`bash
npm run build
\`\`\`

Preview production build:

\`\`\`bash
npm run preview
\`\`\`

## Browser Extension

Smart Prompt provides a Chrome extension to enhance your experience:

1. Install from Chrome Store:
   - Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/cfegclkdkjgpclfahanfgejfjfmpkmjl)
   - Click "Add to Chrome"

2. Manual Installation:
   - Download the latest extension package
   - Extract the downloaded file
   - Visit chrome://extensions/ in Chrome
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extracted folder

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling Solution**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context
- **Routing**: React Router
- **Internationalization**: i18next
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages

## Development Guide

### Project Structure

\`\`\`
smart-prompt/
├── src/
│   ├── components/     # UI components
│   ├── contexts/       # React contexts
│   ├── hooks/         # Custom hooks
│   ├── i18n/          # Internationalization files
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── styles/        # Global styles
├── public/            # Static assets
└── vite.config.ts     # Vite configuration
\`\`\`

### Code Style

The project is developed using TypeScript to ensure type safety. ESLint and Prettier are used to maintain consistent code style.

### Internationalization

i18next is used for internationalization, with translation files located in the \`src/i18n/locales/\` directory.

## Deployment

The project is deployed using Cloudflare Pages. Run the following command to deploy to production:

\`\`\`bash
npm run deploy
\`\`\`

## Feedback and Support

If you have any questions or suggestions, please contact us through:

- Email: feedback@playwithai.fun
- Submit an Issue on GitHub

## License

[MIT License](LICENSE)

## Contributing

We welcome all forms of contributions, including but not limited to:

- Bug reports
- Feature suggestions
- Code contributions
- Documentation improvements

Before submitting a Pull Request, please ensure:

1. Documentation is updated
2. Tests are added/updated
3. All tests pass
4. Existing code style is followed

Thank you to all the developers who have contributed to Smart Prompt!
