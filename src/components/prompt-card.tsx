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
  qualityScore?: number
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
  qualityScore,
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
  const [isFullscreen, setIsFullscreen] = React.useState(false)
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
            <CardContent className="relative flex-1">
              <div className={cn(
                "relative h-full",
                isFullscreen ? "h-[80vh] overflow-y-auto" : "max-h-[200px] overflow-hidden"
              )}>
                <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-muted p-3 rounded-md h-full">
                  {content}
                </pre>
                <div className="absolute bottom-1 right-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-muted hover:bg-muted-foreground/10"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                        <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                        <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                        <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="mt-auto">
              {tags.length > 0 && (
                <div className="px-6 pb-2">
                  <div className="flex flex-wrap gap-1 max-h-[3.5rem] overflow-hidden">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs h-[1.5rem] flex items-center">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 pb-2 px-6 flex items-center justify-between border-t">
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
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="h-4 w-4"
                            >
                              <path d="m12 19-7-7 7-7"/>
                              <path d="M19 12H5"/>
                            </svg>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={5} className="z-[100]">
                        <p>{t.viewOriginal}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {qualityScore !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center h-6 gap-1 text-sm">
                            <span className="text-muted-foreground">质量分</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className={cn(
                                    "w-4 h-4",
                                    star <= (qualityScore / 2) ? "text-yellow-400" : "text-gray-300"
                                  )}
                                >
                                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" sideOffset={5} className="z-[100]">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium">{t.qualityScore}</p>
                            <p>{t.qualityDescription.replace('{score}', String(qualityScore)).replace('{stars}', String(Math.round(qualityScore / 2)))}</p>
                            <p className="text-xs text-muted-foreground">{t.qualityTip}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
            <CardContent className="relative flex-1">
              <div className={cn(
                "relative h-full",
                isFullscreen ? "h-[80vh] overflow-y-auto" : "max-h-[200px] overflow-hidden"
              )}>
                <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-muted p-3 rounded-md h-full">
                  {optimizedContent}
                </pre>
                <div className="absolute bottom-1 right-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-muted hover:bg-muted-foreground/10"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                        <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                        <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                        <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="mt-auto">
              {tags.length > 0 && (
                <div className="px-6 pb-2">
                  <div className="flex flex-wrap gap-1 max-h-[3.5rem] overflow-hidden">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs h-[1.5rem] flex items-center">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 pb-2 px-6 flex items-center justify-between border-t">
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
            </div>
          </Card>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50 bg-background border rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{title || t.untitled}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsFullscreen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              </Button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-muted p-3 rounded-md h-full">
                {isFlipped ? optimizedContent : content}
              </pre>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(isFlipped ? optimizedContent : content)
                          toast.success(t.copySuccess)
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{t.copyToClipboard}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      )}

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
