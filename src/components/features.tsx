import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import { 
  BookmarkIcon, 
  SparklesIcon, 
  TagIcon, 
  PaletteIcon,
  SettingsIcon,
  ActivityIcon
} from 'lucide-react'

const features = [
  {
    icon: BookmarkIcon,
    key: 'collection',
    descKey: 'collectionDesc',
    color: 'group-hover:text-blue-500'
  },
  {
    icon: SparklesIcon,
    key: 'optimization',
    descKey: 'optimizationDesc',
    color: 'group-hover:text-yellow-500'
  },
  {
    icon: TagIcon,
    key: 'tags',
    descKey: 'tagsDesc',
    color: 'group-hover:text-green-500'
  },
  {
    icon: ActivityIcon,
    key: 'evaluation',
    descKey: 'evaluationDesc',
    color: 'group-hover:text-purple-500'
  },
  {
    icon: PaletteIcon,
    key: 'personalization',
    descKey: 'personalizationDesc',
    color: 'group-hover:text-pink-500'
  },
  {
    icon: SettingsIcon,
    key: 'settings',
    descKey: 'settingsDesc',
    color: 'group-hover:text-orange-500'
  },
]

export function Features() {
  const { messages } = useLocale()

  if (!messages) return null
  
  const t = messages.Features

  return (
    <section className="container">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center text-center">
        <h2 className="font-bold text-2xl mb-4 sm:text-3xl">
          {t.title}
        </h2>
        <p className="max-w-[85%] text-lg text-muted-foreground mb-8">
          {t.description}
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map(({ icon: Icon, key, descKey, color }) => (
          <div
            key={key}
            className="relative overflow-hidden rounded-lg border bg-background p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-primary/50 group"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-2">
              <Icon className={`h-8 w-8 transition-all duration-300 ease-in-out group-hover:scale-110 ${color}`} />
              <div className="space-y-2">
                <h3 className={`font-bold transition-colors duration-300 ease-in-out ${color}`}>
                  {t[key]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t[descKey]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}