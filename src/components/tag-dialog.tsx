import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLocale } from "@/contexts/LocaleContext"

interface TagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTags: string[]
  onSubmit: (tags: string[]) => Promise<void>
}

export function TagDialog({
  open,
  onOpenChange,
  initialTags,
  onSubmit
}: TagDialogProps) {
  const { messages } = useLocale()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const t = messages?.Prompts

  // 当对话框打开或 initialTags 变化时重置标签列表
  useEffect(() => {
    if (open) {
      setTags(initialTags)
      setNewTag("")
    }
  }, [open, initialTags])

  if (!t) return null

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await onSubmit(tags)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update tags:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.editTagsTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder={t.tagPlaceholder}
              className="flex-1"
            />
            <Button onClick={handleAddTag} disabled={!newTag}>
              {t.addTag}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {messages?.Common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? messages?.Common.saving : messages?.Common.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
