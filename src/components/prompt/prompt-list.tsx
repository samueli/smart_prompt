"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { PromptCard } from "./prompt-card"
import { Prompt } from "@/types/prompt"

// 使用固定的模拟数据
const mockPrompts: Prompt[] = [
  {
    id: "prompt-1",
    title: "GPT-4 System Prompt",
    content: "You are a helpful AI assistant...",
    tags: [{ id: "tag-1", name: "System", color: "#2563eb" }],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export function PromptList() {
  const t = useTranslations("Prompts")
  const [prompts] = React.useState<Prompt[]>(mockPrompts)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  )
} 