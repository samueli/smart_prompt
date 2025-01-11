import { Megaphone, Pencil, Globe, Cpu, Code, Palette, Brain, Lightbulb } from 'lucide-react'

export interface Category {
  id: string
  name: {
    'zh-CN': string
    'en-US': string
  }
  description: {
    'zh-CN': string
    'en-US': string
  }
  icon?: any
}

export const PROMPT_CATEGORIES: Category[] = [
  {
    id: 'marketing',
    name: {
      'zh-CN': '市场营销',
      'en-US': 'Marketing'
    },
    description: {
      'zh-CN': '营销相关提示词',
      'en-US': 'Marketing related prompts'
    },
    icon: Megaphone
  },
  {
    id: 'writing',
    name: {
      'zh-CN': '文案写作',
      'en-US': 'Writing'
    },
    description: {
      'zh-CN': '文案写作相关提示词',
      'en-US': 'Writing related prompts'
    },
    icon: Pencil
  },
  {
    id: 'website',
    name: {
      'zh-CN': '网站开发',
      'en-US': 'Website'
    },
    description: {
      'zh-CN': '网站开发相关提示词',
      'en-US': 'Website development prompts'
    },
    icon: Globe
  },
  {
    id: 'tech',
    name: {
      'zh-CN': '科技媒体',
      'en-US': 'Technology'
    },
    description: {
      'zh-CN': '科技媒体相关提示词',
      'en-US': 'Technology related prompts'
    },
    icon: Cpu
  },
  {
    id: 'development',
    name: {
      'zh-CN': '编程开发',
      'en-US': 'Development'
    },
    description: {
      'zh-CN': '编程开发相关提示词',
      'en-US': 'Development related prompts'
    },
    icon: Code
  },
  {
    id: 'design',
    name: {
      'zh-CN': '视觉设计',
      'en-US': 'Design'
    },
    description: {
      'zh-CN': '视觉设计相关提示词',
      'en-US': 'Design related prompts'
    },
    icon: Palette
  },
  {
    id: 'ai',
    name: {
      'zh-CN': '人工智能',
      'en-US': 'AI'
    },
    description: {
      'zh-CN': 'AI 相关提示词',
      'en-US': 'AI related prompts'
    },
    icon: Brain
  },
  {
    id: 'other',
    name: {
      'zh-CN': '其他',
      'en-US': 'Others'
    },
    description: {
      'zh-CN': '其他类型提示词',
      'en-US': 'Other types of prompts'
    },
    icon: Lightbulb
  }
]
