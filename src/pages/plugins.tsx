import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from "@/components/ui/button"
import { 
  Chrome, 
  Download, 
  Star, 
  Sparkles, 
  Zap
} from "lucide-react"

export default function PluginsPage() {
  const { messages } = useLocale()

  if (!messages) {
    return null
  }

  const t = messages.Plugins

  const features = [
    {
      icon: <Star className="h-8 w-8" />,
      title: t.features?.collect?.title,
      description: t.features?.collect?.description,
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: t.features?.optimize?.title,
      description: t.features?.optimize?.description,
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t.features?.sync?.title,
      description: t.features?.sync?.description,
    }
  ]

  return (
    <div className="container max-w-6xl mx-auto py-8">
      {/* 顶部介绍区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t?.title || 'Smart Prompt Plugin'}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t?.description || 'Enhance your AI prompt experience with our Chrome extension'}
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/lib/smart_prompt_extension_v1.0.zip'
              link.download = 'smart_prompt_extension_v1.0.zip'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-5 w-5" />
            {t?.downloadText || 'Download Extension'}
          </Button>
          <Button 
            size="lg" 
            className="gap-2"
            variant="outline"
            onClick={() => {
              window.open('https://chrome.google.com/webstore/detail/cfegclkdkjgpclfahanfgejfjfmpkmjl', '_blank')
            }}
          >
            <Chrome className="h-5 w-5" />
            {t?.chromeStore || 'Install from Chrome Store'}
          </Button>
        </div>
      </div>

      {/* 截图展示区域 */}
      <div className="mb-16 px-4">
        <div className="rounded-lg overflow-hidden border shadow-lg bg-background">
          <div className="relative w-full">
            <img 
              src="/images/screenshot1.png" 
              alt="Plugin Screenshot"
              className="w-full h-auto"
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* 特性介绍区域 */}
      <div className="bg-muted/50 rounded-lg py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t?.coreFeatures?.title || 'Core Features'}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t?.coreFeatures?.description || 'Make your prompt management smarter and more efficient'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-lg bg-background border"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部 CTA 区域 */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          {t?.cta?.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t?.cta?.description || 'Download our Chrome extension and start optimizing your prompts today'}
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/lib/smart_prompt_extension_v1.0.zip'
              link.download = 'smart_prompt_extension_v1.0.zip'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-5 w-5" />
            {t?.downloadText || 'Download Extension'}
          </Button>
          <Button 
            size="lg" 
            className="gap-2"
            variant="outline"
            onClick={() => {
              window.open('https://chrome.google.com/webstore/detail/cfegclkdkjgpclfahanfgejfjfmpkmjl', '_blank')
            }}
          >
            <Chrome className="h-5 w-5" />
            {t?.chromeStore || 'Install from Chrome Store'}
          </Button>
        </div>
      </div>
    </div>
  )
}
