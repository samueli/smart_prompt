import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw,
  GitFork,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { useLocale } from "@/contexts/LocaleContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { SharePosterDialog } from '@/components/share-poster-dialog'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface PromptCardProps {
  id: string
  title: string
  content: string
  optimizedContent: string
  isPublic: boolean
  tags: readonly string[]
  updatedAt: string
  onShare: (id: string) => void
  onTogglePublic?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onEditTags?: (id: string) => void
  onOptimize?: (id: string) => void
  onFork?: (prompt: { title: string, source_prompt: string, optimized_prompt: string }) => void
  className?: string
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
  onOptimize,
  onFork,
  className,
}: PromptCardProps) {
  const { messages, locale } = useLocale()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [isFlipped, setIsFlipped] = React.useState(false)
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
    try {
      navigator.clipboard.writeText(text)
      toast.success(t.copySuccess, { duration: 3000 })
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleShare = () => {
    onShare(id)
    setShowShareDialog(false)
  }

  const handleShareCancel = () => {
    setShowShareDialog(false)
  }

  const handleGoToOptimize = () => {
    const params = new URLSearchParams({
      promptId: id,
      title: title,
      sourcePrompt: content
    })
    navigate(`/${locale}/optimizer?${params.toString()}`)
  }

  const handleFlip = () => {
    if (optimizedContent) {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div className={cn("relative min-h-[400px] group/card", className)}>
      <div className="perspective-1000">
        <div
          className={cn(
            "transform-style-3d card-container",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* 正面 - 原始提示词 */}
          <Card className={cn(
            "backface-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full",
            !isFlipped ? "z-[1]" : "z-0"
          )}>
            <CardHeader className="pb-2 relative flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CardTitle className="text-base font-medium truncate">{title || t.untitled}</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                            onClick={handleFlip}
                            disabled={!optimizedContent}
                          >
                            <RefreshCw className={cn("h-4 w-4", !optimizedContent && "text-muted-foreground")} />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={5} className="z-[100]">
                        <p>{!optimizedContent ? t.noOptimized : (isFlipped ? t.viewOriginal : t.viewOptimized)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-muted"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px]">
                    <DropdownMenuItem 
                      className="flex items-center px-2 py-1.5 cursor-pointer"
                      onClick={() => onShare(id)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      <span className="flex-1">{t.share}</span>
                    </DropdownMenuItem>
                    {onFork && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onFork({
                          title: `${title} (Fork)`,
                          source_prompt: content,
                          optimized_prompt: optimizedContent
                        })}
                      >
                        <GitFork className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.fork}</span>
                      </DropdownMenuItem>
                    )}
                    {onOptimize && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={handleGoToOptimize}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.goToOptimize}</span>
                      </DropdownMenuItem>
                    )}
                    {onTogglePublic && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onTogglePublic(id)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <span>{t.publish}</span>
                          <Badge variant="secondary" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 text-[10px] px-1.5 py-0">
                            Pro
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    )}
                    {onEditTags && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onEditTags(id)}
                      >
                        <Tags className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.editTags}</span>
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onEdit(id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.edit}</span>
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.delete}</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="relative">
                <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-muted p-3 rounded-md max-h-[240px] overflow-auto">
                  {content}
                </pre>
              </div>
            </CardContent>
            <div className="mt-auto pt-2 pb-2 px-6 flex items-center justify-between border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formattedDate}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-muted"
                onClick={() => handleCopy(content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* 反面 - 优化后提示词 */}
          <Card className={cn(
            "backface-hidden rotate-y-180 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full",
            isFlipped ? "z-[1]" : "z-0"
          )}>
            <CardHeader className="pb-2 relative flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CardTitle className="text-base font-medium truncate">{title || t.untitled}</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                            onClick={handleFlip}
                            disabled={!optimizedContent}
                          >
                            <RefreshCw className={cn("h-4 w-4", !optimizedContent && "text-muted-foreground")} />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={5} className="z-[100]">
                        <p>{!optimizedContent ? t.noOptimized : (isFlipped ? t.viewOriginal : t.viewOptimized)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-muted"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px]">
                    <DropdownMenuItem 
                      className="flex items-center px-2 py-1.5 cursor-pointer"
                      onClick={() => onShare(id)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      <span className="flex-1">{t.share}</span>
                    </DropdownMenuItem>
                    {onFork && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onFork({
                          title: `${title} (Fork)`,
                          source_prompt: content,
                          optimized_prompt: optimizedContent
                        })}
                      >
                        <GitFork className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.fork}</span>
                      </DropdownMenuItem>
                    )}
                    {onOptimize && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={handleGoToOptimize}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.goToOptimize}</span>
                      </DropdownMenuItem>
                    )}
                    {onTogglePublic && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onTogglePublic(id)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <span>{t.publish}</span>
                          <Badge variant="secondary" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 text-[10px] px-1.5 py-0">
                            Pro
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    )}
                    {onEditTags && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onEditTags(id)}
                      >
                        <Tags className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.editTags}</span>
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onClick={() => onEdit(id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.edit}</span>
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        className="flex items-center px-2 py-1.5 cursor-pointer text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span className="flex-1">{t.delete}</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="relative">
                <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-muted p-3 rounded-md max-h-[240px] overflow-auto">
                  {optimizedContent}
                </pre>
              </div>
            </CardContent>
            <div className="mt-auto pt-2 pb-2 px-6 flex items-center justify-between border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formattedDate}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-muted"
                onClick={() => handleCopy(optimizedContent)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t.confirmDelete}
        description={t.deleteMessage}
        onConfirm={handleDelete}
        onCancel={handleDeleteCancel}
      />

      <SharePosterDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={title}
        content={content}
        onShare={handleShare}
        onCancel={handleShareCancel}
      />
    </div>
  )
}
