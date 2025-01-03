export interface NavItem {
  title: string
  href: string
}

export interface Message {
  [key: string]: any
}

export interface LocaleMessages {
  [locale: string]: Message
} 