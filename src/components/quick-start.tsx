import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from "lucide-react"

export function QuickStart() {
  const { messages, locale } = useLocale()

  if (!messages) return null

  const t = messages.QuickStart

  return (
    <main className="pt-8">
      <section className="container py-6 md:py-8 lg:py-12">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-3 text-center">
          <h2 className="font-bold text-2xl leading-[1.1] sm:text-3xl md:text-5xl">
            {t.title}
          </h2>
          <p className="max-w-[85%] leading-normal text-lg text-muted-foreground sm:text-xl sm:leading-7">
            {t.description}
          </p>
          <div className="flex gap-4">
            <Link to={`/${locale}/prompts/new`}>
              <Button size="lg" className="gap-2">
                <Sparkles className="mr-2 h-4 w-4" />
                {t.createPrompt}
              </Button>
            </Link>
            <Link to={`/${locale}/docs/getting-started`}>
              <Button variant="outline" size="lg" className="gap-2">
                {t.learnMore}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}