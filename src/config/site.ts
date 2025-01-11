import { Locale } from '@/i18n.config'

interface NavItem {
  title: string
  href: string
}

interface SiteConfig {
  name: string
  description: string
  locales: Locale[]
  defaultLocale: Locale
  mainNav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: 'Smart Prompt',
  description: 'AI Prompt Management Tool',
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  mainNav: [
    {
      title: 'market',
      href: '/market',
    },
    {
      title: 'prompts',
      href: '/prompts',
    },
    {
      title: 'optimizer',
      href: '/optimizer',
    },
    {
      title: 'evaluator',
      href: '/evaluator',
    },
    {
      title: 'plugins',
      href: '/plugins',
    },
    {
      title: 'settings',
      href: '/settings',
    },
  ],
}

// 添加一个新的配置来处理客户端水合
export const clientConfig = {
  // 禁用自动检测语言
  autoDetectLocale: false,
  // 强制使用服务端提供的语言设置
  forceServerLocale: true,
  // 禁用运行时切换语言
  disableRuntimeLocaleSwitch: true
}