import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n/config'
import enUS from '@/i18n/locales/en-US.json'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  messages: any
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(() => {
    const savedLocale = localStorage.getItem('userLocale')
    return savedLocale || i18n.language || 'en-US'
  })
  const { i18n: i18nInstance } = useTranslation()

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    i18nInstance.changeLanguage(newLocale)
    localStorage.setItem('userLocale', newLocale)
  }

  // 确保总是有默认的 messages
  const messages = i18n.getResourceBundle(locale, 'translation') || enUS

  const contextValue = {
    locale,
    setLocale,
    messages
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}