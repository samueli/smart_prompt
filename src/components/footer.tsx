"use client"

import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import { Link } from 'react-router-dom'

export function Footer() {
  const { messages, locale } = useLocale()

  if (!messages) return null

  const t = messages.Footer
  const year = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {year} Smart Prompt. {t.rights}
          </p>
          {/* <span className="text-sm text-muted-foreground">
            Powered by <a href="https://302.ai" target="_blank" rel="noopener noreferrer" className="hover:underline">302.ai</a>
          </span> */}
        </div>
        <div className="flex gap-4">
          <a href="/policy.html" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
            {t.privacy}
          </a>
          <Link to={`/${locale}/terms`} className="text-sm text-muted-foreground hover:underline">
            {t.terms}
          </Link>
          <a href="mailto:feedback@playwithai.fun" className="feedback-link">
            <span className="material-symbols-rounded">mail</span>
            {t.feedback}
          </a>
        </div>
      </div>
    </footer>
  )
}