import { useLocale } from '../contexts/LocaleContext'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function QuickStart() {
  const { messages } = useLocale()
  const t = messages.QuickStart

  return (
    <section className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {t.title}
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {t.description}
        </p>
        <div className="flex gap-4">
          <Link to="/prompts/new">
            <Button size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {t.createPrompt}
            </Button>
          </Link>
          <Link to="/docs/getting-started">
            <Button variant="outline" size="lg">
              {t.learnMore}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 