import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { toast } from "sonner"

export interface PromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  initialData?: {
    title: string
    source_prompt: string
    optimized_prompt: string
    tags: string[],
    creator: string
    is_public: number
  }
  onSubmit: (data: {
    title: string
    source_prompt: string
    optimized_prompt: string
    is_public: number
    creator: string
    tags: string[]
  }) => Promise<void>
}

export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  initialData,
  onSubmit
}: PromptDialogProps) {
  const { messages } = useLocale()
  const t = messages?.Prompts
  
  const [loading, setLoading] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [sourcePrompt, setSourcePrompt] = useState("")
  const [optimizedPrompt, setOptimizedPrompt] = useState("")
  const [isPublic] = useState(initialData?.is_public ?? 0)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<{
    title?: string;
    source_prompt?: string;
  }>({})

  // 当对话框打开或 initialData 变化时重置表单
  useEffect(() => {
    if (open) {
      setPromptTitle(initialData?.title ?? "")
      setSourcePrompt(initialData?.source_prompt ?? "")
      setOptimizedPrompt(initialData?.optimized_prompt ?? "")
      setTags(initialData?.tags ?? [])
      setNewTag("")
      setErrors({})
    }
  }, [open, initialData])

  const validateForm = () => {
    const newErrors: {
      title?: string;
      source_prompt?: string;
    } = {}

    if (!promptTitle.trim()) {
      newErrors.title = t?.titleRequired || "Title is required"
    }

    if (!sourcePrompt.trim()) {
      newErrors.source_prompt = t?.sourcePromptRequired || "Source prompt is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await onSubmit({
        title: promptTitle,
        source_prompt: sourcePrompt,
        optimized_prompt: optimizedPrompt,
        is_public: isPublic,
        creator: 'user',
        tags
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save prompt:', error)
      toast.error(t?.saveFailed || "Failed to save prompt", { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt_title">
              {t?.title || "Title"} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="prompt_title"
              value={promptTitle}
              onChange={(e) => {
                setPromptTitle(e.target.value)
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }))
                }
              }}
              placeholder={t?.titlePlaceholder || "Enter prompt title"}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source_prompt">
              {t?.sourcePrompt || "Source Prompt"} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="source_prompt"
              value={sourcePrompt}
              onChange={(e) => {
                setSourcePrompt(e.target.value)
                if (errors.source_prompt) {
                  setErrors(prev => ({ ...prev, source_prompt: undefined }))
                }
              }}
              placeholder={t?.sourcePromptPlaceholder || "Enter source prompt"}
              className={errors.source_prompt ? "border-red-500" : ""}
            />
            {errors.source_prompt && (
              <p className="text-sm text-red-500">{errors.source_prompt}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="optimized_prompt">{t?.optimizedPrompt}</Label>
            <Textarea
              id="optimized_prompt"
              value={optimizedPrompt}
              onChange={(e) => setOptimizedPrompt(e.target.value)}
              placeholder={t?.optimizedPromptPlaceholder}
              className="h-24"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t?.tags}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder={t?.addTagPlaceholder}
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
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {messages?.Common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? messages?.Common.saving : messages?.Common.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
