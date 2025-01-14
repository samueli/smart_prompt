import { Megaphone, Pencil, Code, Palette, Brain, Lightbulb, GraduationCap, Smile, Rocket, Coffee, Theater } from 'lucide-react'

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
    id: 'assistant',
    name: {
      'zh-CN': '智能助手',
      'en-US': 'AI Assistant'
    },
    description: {
      'zh-CN': '智能助手相关提示词',
      'en-US': 'AI Assistant related prompts'
    },
    icon: Brain
  },
  {
    id: 'productivity',
    name: {
      'zh-CN': '效率工具',
      'en-US': 'Productivity'
    },
    description: {
      'zh-CN': '效率工具相关提示词',
      'en-US': 'Productivity related prompts'
    },
    icon: Rocket
  },
  {
    id: 'lifestyle',
    name: {
      'zh-CN': '生活方式',
      'en-US': 'Lifestyle'
    },
    description: {
      'zh-CN': '生活方式相关提示词',
      'en-US': 'Lifestyle related prompts'
    },
    icon: Coffee
  },
  {
    id: 'role-playing',
    name: {
      'zh-CN': '角色扮演',
      'en-US': 'Role Playing'
    },
    description: {
      'zh-CN': '角色扮演相关提示词',
      'en-US': 'Role Playing related prompts'
    },
    icon: Theater
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
    id: 'education',
    name: {
      'zh-CN': '教学辅导',
      'en-US': 'Education'
    },
    description: {
      'zh-CN': '教学辅导相关提示词',
      'en-US': 'Education related prompts'
    },
    icon: GraduationCap
  },
  {
    id: 'entertainment',
    name: {
      'zh-CN': '娱乐休闲',
      'en-US': 'Entertainment'
    },
    description: {
      'zh-CN': '娱乐休闲相关提示词',
      'en-US': 'Entertainment related prompts'
    },
    icon: Smile
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
