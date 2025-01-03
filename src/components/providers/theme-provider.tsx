import { ReactNode } from 'react'
import { ThemeProvider as ThemeContextProvider } from '@/contexts/ThemeContext'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  )
} 