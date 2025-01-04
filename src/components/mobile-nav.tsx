"use client"

import * as React from "react"
import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '@/contexts/LocaleContext'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu } from "lucide-react"
import { siteConfig } from "@/config/site"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const { messages, locale } = useLocale()

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="p-0 w-9"
        onClick={() => setOpen(!open)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-14 z-50 grid gap-2 border-b bg-background p-6 shadow-lg animate-in slide-in-from-top-2">
            <nav className="grid grid-flow-row auto-rows-max text-sm gap-2">
              {siteConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  to={`/${locale}${item.href}`}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent",
                    location.pathname === `/${locale}${item.href}`
                      ? "text-foreground font-semibold"
                      : "text-foreground/60"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {messages.Header[item.title]}
                    {item.title === 'evaluator' && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 text-[10px] px-1.5 py-0">
                        Pro
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}