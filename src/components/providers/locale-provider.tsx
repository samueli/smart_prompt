import { ReactNode } from 'react'
import { LocaleProvider as LocaleContextProvider } from '@/contexts/LocaleContext'

interface LocaleProviderProps {
  children: ReactNode
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  return (
    <LocaleContextProvider>
      {children}
    </LocaleContextProvider>
  )
} 