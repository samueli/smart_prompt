"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useLocale } from '@/contexts/LocaleContext'

export function LocaleToggle() {
  const { locale, setLocale, messages } = useLocale()

  if (!messages) return null

  const toggleLocale = () => {
    const newLocale = locale === 'zh-CN' ? 'en-US' : 'zh-CN'
    setLocale(newLocale)
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLocale}
      title={messages.Common?.switchLanguage ?? "切换语言 / Switch Language"}
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">
        {messages.Common?.switchLanguage ?? "切换语言 / Switch Language"}
      </span>
    </Button>
  )
}