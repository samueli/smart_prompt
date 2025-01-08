import { ModeToggle } from "@/components/mode-toggle"
import { LocaleToggle } from "@/components/locale-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocale } from '@/contexts/LocaleContext'
import { Link } from 'react-router-dom'
import { Chrome, Download, BarChart2 } from "lucide-react"

export function Header() {
  const { messages, locale } = useLocale()

  if (!messages) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to={`/${locale}`} className="flex items-center gap-2">
            <img 
              src="https://pic1.imgdb.cn/item/6774c519d0e0a243d4ed4c17.png" 
              alt="Smart Prompt Logo" 
              className="h-8 w-8 transition-transform duration-300 hover:scale-110"
            />
            <span className="font-bold text-lg">
              Smart Prompt
            </span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to={`/${locale}/prompts`} className="text-sm font-medium transition-colors hover:text-foreground/80">
            {messages.Header.prompts}
          </Link>
          <Link to={`/${locale}/optimizer`} className="text-sm font-medium transition-colors hover:text-foreground/80">
            {messages.Header.optimizer}
          </Link>
          <Link to={`/${locale}/evaluator`} className="text-sm font-medium transition-colors hover:text-foreground/80 flex items-center gap-2">
            {messages.Header.evaluator}
            <Badge variant="secondary" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 text-[10px] px-1.5 py-0">
              Pro
            </Badge>
          </Link>
          <Link to={`/${locale}/settings`} className="text-sm font-medium transition-colors hover:text-foreground/80">
            {messages.Header.settings}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link 
            to={`/${locale}/plugins`} 
            className="hidden sm:inline-flex items-center justify-center"
          >
            <Button variant="default" size="sm" className="gap-2">
              <Chrome className="h-4 w-4" />
              <Download className="h-4 w-4" />
              <span className="hidden md:inline-block">
                {messages.Plugins.downloadText}
              </span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ModeToggle />
            <Button variant="ghost" size="sm">
              {messages.Header.login}
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}