"use client"

import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { ArrowRight, Chrome } from "lucide-react"

export function Hero() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-24 md:pt-32">
        <div className="h-12 w-96 animate-pulse bg-muted rounded-lg" />
        <div className="h-6 w-80 animate-pulse bg-muted rounded-lg" />
        <div className="flex gap-4">
          <div className="h-10 w-32 animate-pulse bg-muted rounded-lg" />
          <div className="h-10 w-32 animate-pulse bg-muted rounded-lg" />
        </div>
      </section>
    )
  }

  const { messages, locale } = useLocale()

  if (!messages) return null

  const t = messages.Hero

  return (
    <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-24 md:pt-32">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
        {t.title}
      </h1>
      <p className="max-w-[640px] text-center text-lg text-muted-foreground sm:text-xl">
        {t.description}
      </p>
      <div className="flex gap-4">
        <Link to={`/${locale}/prompts`}>
          <Button size="lg">
            {t.getStarted}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to={`/${locale}/plugins`}>
          <Button variant="outline" size="lg">
            <Chrome className="mr-2 h-4 w-4" />
            {messages.Plugins.title}
          </Button>
        </Link>
        <Link to="/docs">
          <Button variant="ghost" size="lg">
            {t.documentation}
          </Button>
        </Link>
      </div>
    </section>
  )
}