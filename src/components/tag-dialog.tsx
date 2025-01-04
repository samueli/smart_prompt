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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.editTags}</DialogTitle>
          <DialogDescription>
            {t.editTagsDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder={t.addTagPlaceholder}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t.saving : t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
