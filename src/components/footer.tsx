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
        <div className="flex gap-4 items-center">
          <a href="/policy.html" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
            {t.privacy}
          </a>
          <Link to={`/${locale}/terms`} className="text-sm text-muted-foreground hover:underline">
            {t.terms}
          </Link>
          <a 
            href="mailto:feedback@playwithai.fun" 
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="text-sm">{t.feedback}</span>
          </a>
        </div>
      </div>
    </footer>
  )
}