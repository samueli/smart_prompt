"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tag } from "@/types/prompt"

interface TagInputProps {
  tags: Tag[]
  onChange: (tags: Tag[]) => void
}

let tagCounter = 0

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input) {
      e.preventDefault()
      tagCounter++
      const newTag: Tag = {
        id: `tag-${tagCounter}`,
        name: input,
        color: getTagColor(tagCounter),
      }
      onChange([...tags, newTag])
      setInput("")
    }
  }

  const removeTag = (id: string) => {
    onChange(tags.filter((tag) => tag.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            style={{ borderColor: tag.color, color: tag.color }}
            className="flex items-center gap-1"
          >
            {tag.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag.id)}
            />
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add tags"
      />
    </div>
  )
}

const tagColors = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#db2777"]

function getTagColor(index: number): string {
  return tagColors[index % tagColors.length]
} 