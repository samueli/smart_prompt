// API 配置
export const API_BASE_URL = 'https://prompt-api.playwithai.fun'

// 其他常量配置
export const MAX_TITLE_LENGTH = 100
export const MAX_PROMPT_LENGTH = 2000
export const MAX_TAGS = 5
export const MAX_TAG_LENGTH = 20

export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
}

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } }
}

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } }
}