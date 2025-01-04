import * as React from "react"
import { useLocale } from '@/contexts/LocaleContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  'general',
  'collection',
  'optimization',
  'evaluation',
  'tags',
  'personalization',
  'token',
  'privacy',
  'extension'
]

export function FAQ() {
  const { messages } = useLocale()

  if (!messages) return null

  const t = messages.FAQ

  return (
    <section className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {t.title}
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mb-8">
          {t.description}
        </p>
      </div>
      <div className="mx-auto max-w-[58rem]">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-left">
                {t[key].question}
              </AccordionTrigger>
              <AccordionContent>
                {t[key].answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}