/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next-themes" {
  export type ThemeProviderProps = {
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
    forcedTheme?: string
    themes?: string[]
  }
  
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element
  export function useTheme(): {
    theme: string | undefined
    setTheme: (theme: string) => void
    resolvedTheme: string | undefined
    themes: string[]
  }
}

declare module "next-intl" {
  export function useTranslations(namespace?: string): (key: string) => string
} 