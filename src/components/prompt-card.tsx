import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Share2,
  Globe,
  Lock,
  Tags,
  MoreVertical,
  Pencil,
  Trash,
  Copy,
  Wand2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { useLocale } from "@/contexts/LocaleContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface PromptCardProps {
  id: string
  title: string
  content: string
  optimizedContent: string
  isPublic: boolean
  tags: readonly string[]  // 这里只接受解析后的字符串数组
  updatedAt: string
  onShare: (id: string) => void
  onTogglePublic: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onEditTags: (id: string) => void
}

export function PromptCard({
  id,
  title,
  content,
  optimizedContent,
  isPublic,
  tags,
  updatedAt,
  onShare,
  onTogglePublic,
  onEdit,
  onDelete,
  onEditTags,
}: PromptCardProps) {
  const { messages, locale } = useLocale()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [showPublishDialog, setShowPublishDialog] = React.useState(false)
  const t = messages?.Prompts

  if (!t) return null

  const dateLocale = locale === "zh-CN" ? zhCN : enUS
  const formattedDate = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
    locale: dateLocale,
  })

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete(id)
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t.copySuccess)
  }

  const handleShare = () => {
    onShare(id)
    setShowShareDialog(false)
  }

  const handleShareCancel = () => {
    setShowShareDialog(false)
  }

  const handleGoToEvaluate = () => {
    setShowPublishDialog(false)
    const params = new URLSearchParams({
      promptId: id,
      title: title,
      sourcePrompt: content
    })
    navigate(`/${locale}/optimizer?${params.toString()}`)
  }

  const handleConfirmPublish = () => {
    setShowPublishDialog(false)
    onTogglePublic(id)
  }

  return (
    <>
      <div className="relative rounded-lg border bg-card p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2 min-w-0"> 
            <h2 className="text-lg font-bold truncate max-w-full">{title}</h2>
            <Tabs defaultValue="source" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="source">{t.sourcePrompt}</TabsTrigger>
                <TabsTrigger value="optimized">{t.optimizedPrompt}</TabsTrigger>
              </TabsList>
              <TabsContent value="source" className="mt-0">
                <div className="relative group">
                  <p className="text-sm line-clamp-3 whitespace-pre-wrap break-words max-w-[calc(100vw-3rem)]">{content}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 h-6 w-6"
                    onClick={() => handleCopy(content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="optimized" className="mt-0">
                <div className="relative group">
                  <p className="text-sm line-clamp-3 whitespace-pre-wrap break-words max-w-[calc(100vw-3rem)]">{optimizedContent}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 h-6 w-6"
                    onClick={() => handleCopy(optimizedContent)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                {t.share}
              </DropdownMenuItem>
              {/* 如果是私有提示词列表中的私有提示词，显示所有编辑选项 */}
              {!isPublic && (
                <>
                  <DropdownMenuItem onClick={handleGoToEvaluate}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {t.goToOptimize}
                  </DropdownMenuItem>
                  {onTogglePublic && (
                    <DropdownMenuItem onClick={() => setShowPublishDialog(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {t.publish}
                    </DropdownMenuItem>
                  )}
                  {onEditTags && (
                    <DropdownMenuItem onClick={() => onEditTags(id)}>
                      <Tags className="mr-2 h-4 w-4" />
                      {t.editTags}
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t.edit}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {t.delete}
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          {(tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {isPublic ? (
            <Globe className="h-3 w-3" />
          ) : (
            <Lock className="h-3 w-3" />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t.confirmDelete}
        description={t.deleteMessage}
        confirmText={t.delete}
        cancelText={t.cancel}
        onConfirm={handleDelete}
        onCancel={handleDeleteCancel}
        variant="destructive"
      />

      <ConfirmDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={t.confirmShare}
        description={t.shareMessage}
        confirmText={t.share}
        cancelText={t.cancel}
        onConfirm={handleShare}
        onCancel={handleShareCancel}
      />

      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.publishPrompt || "发布提示词"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.publishMessage || "后续提交到public，需要经过平台评测审核，确保质量"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPublishDialog(false)}>
              {t.cancel || "取消"}
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => handleGoToEvaluate()}
            >
              {t.goToOptimize || "去优化"}
            </Button>
            <AlertDialogAction
              onClick={handleConfirmPublish}
            >
              {t.confirmPublish || "已评测确认发布"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
