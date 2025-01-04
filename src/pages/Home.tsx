import { useLocale } from '@/contexts/LocaleContext'
import { QuickStart } from '@/components/quick-start'
import { Features } from '@/components/features'
import { FAQ } from '@/components/faq'

export function Home() {
  const { messages } = useLocale()
  const t = messages.Home || {}

  return (
    <div className="container pt-2">
      <QuickStart />
      <div className="mt-8">
        <Features />
      </div>
      <div className="mt-8">
        <FAQ />
      </div>
    </div>
  )
}