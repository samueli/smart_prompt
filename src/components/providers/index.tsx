import { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { LocaleProvider } from './locale-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  )
} 