import { ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {children}
        <Toaster
          position="top-center"
          expand={true}
          richColors
          closeButton
        />
      </LocaleProvider>
    </ThemeProvider>
  )
}