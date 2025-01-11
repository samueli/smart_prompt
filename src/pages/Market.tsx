import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Search, Tag, Layers, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/contexts/LocaleContext'
import { API_BASE_URL } from '@/config/env'
import { PromptCard } from '@/components/prompt-card'
import { PROMPT_CATEGORIES } from '@/config/categories'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SharePosterDialog } from '@/components/share-poster-dialog'
import { useTokenCheck } from '@/hooks/useTokenCheck'
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

interface Prompt {
  id: string
  title: string
  tags: string | string[]
  creator: string
  create_time: string
  update_time: string
  status: number
  is_public: number
  source_prompt: string
  optimized_prompt: string
  category: string
}

export function Market() {
  const { locale } = useLocale()
  const { t } = useTranslation()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [sharePosterOpen, setSharePosterOpen] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(window.innerWidth < 768)
  const checkToken = useTokenCheck()
  const [forkDialogOpen, setForkDialogOpen] = useState(false)
  const [promptToFork, setPromptToFork] = useState<{ title: string, source_prompt: string, optimized_prompt: string } | null>(null)

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsNavCollapsed(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 预设的分类列表
  const categories = useMemo(() => PROMPT_CATEGORIES.map(category => ({
    id: category.id,
    name: category.name[locale as 'zh-CN' | 'en-US'],
    description: category.description[locale as 'zh-CN' | 'en-US'],
    icon: category.icon
  })), [locale])

  const fetchPrompts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts/public`)
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t('Market.fetchError'))
      }
      setPrompts(result.data)
    } catch (error) {
      toast.error(t('Market.fetchError'), {
        description: error instanceof Error ? error.message : t('Market.fetchError'),
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

  const handleShare = (id: string) => {
    const prompt = prompts.find(p => p.id === id)
    if (prompt) {
      setSelectedPrompt(prompt)
      setSharePosterOpen(true)
    }
  }

  const handleFork = async (prompt: { title: string, source_prompt: string, optimized_prompt: string }) => {
    setPromptToFork({
      title: prompt.title,
      source_prompt: prompt.source_prompt,
      optimized_prompt: prompt.optimized_prompt
    })
    setForkDialogOpen(true)
  }

  const handleConfirmFork = async () => {
    if (!promptToFork) return

    try {
      if (!checkToken(t('Common.tokenRequired'))) {
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          title: promptToFork.title,
          source_prompt: promptToFork.source_prompt,
          optimized_prompt: promptToFork.optimized_prompt,
          tags: '[]',
          is_public: 0
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(t('Market.forkSuccess'))
      } else {
        toast.error(data.error || t('Common.unknownError'))
      }
    } catch (error) {
      console.error('Fork error:', error)
      toast.error(t('Common.unknownError'))
    } finally {
      setForkDialogOpen(false)
      setPromptToFork(null)
    }
  }

  return (
    <div className="container mx-auto py-6 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold mb-6">{t('Market.pageTitle')}</h1>
      <div className="flex gap-8 relative">
        {/* 左侧分类栏 - 桌面端 */}
        <div className={cn(
          "transition-all duration-300 ease-in-out hidden md:block",
          isNavCollapsed ? "w-12" : "w-72",
          "shrink-0"
        )}>
          <Card className="p-4 relative sticky top-20">
            <div className="absolute right-2 top-2 z-20">
              <button
                className="p-1 hover:bg-muted rounded-md"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                title={t(isNavCollapsed ? 'Market.categoryExpand' : 'Market.categoryCollapse')}
              >
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  !isNavCollapsed ? "rotate-180" : ""
                )} />
              </button>
            </div>
            <div className={cn(
              "transition-opacity duration-300",
              isNavCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-auto"
            )}>
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t('Market.categoryTitle')}</h2>
              </div>
              <div className="space-y-1">
                <button
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-muted/60 group",
                    selectedCategory === null && "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  onClick={() => setSelectedCategory(null)}
                >
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{t('Market.allCategories')}</span>
                  </div>
                  <Badge variant="outline" className="bg-background">
                    {prompts.length}
                  </Badge>
                </button>
                {categories.map((category) => {
                  const categoryPrompts = prompts.filter(p => p.category === category.id)
                  return (
                    <button
                      key={category.id}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                        "hover:bg-muted/60 group",
                        selectedCategory === category.id && "bg-primary/10 text-primary hover:bg-primary/15"
                      )}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        {category.icon && <category.icon className="w-4 h-4" />}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="outline" className="bg-background">
                        {categoryPrompts.length}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 w-full"
                placeholder={t('Market.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-48 animate-pulse" />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('market.noPrompts')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts
                .filter((prompt) => {
                  if (!selectedCategory) return true
                  return prompt.category === selectedCategory
                })
                .filter((prompt) => {
                  if (!searchQuery) return true
                  return (
                    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    prompt.source_prompt.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                })
                .map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.source_prompt}
                    optimizedContent={prompt.optimized_prompt}
                    isPublic={prompt.is_public === 1}
                    tags={Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]')}
                    updatedAt={prompt.update_time}
                    onShare={() => handleShare(prompt.id)}
                    onFork={() => handleFork(prompt)}
                    className="h-full"
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 移动端底部分类导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            <button
              className={cn(
                "flex-shrink-0 px-3 py-2 rounded-lg transition-colors whitespace-nowrap",
                selectedCategory === null ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
              )}
              onClick={() => setSelectedCategory(null)}
            >
              {t('Market.allCategories')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-lg transition-colors whitespace-nowrap",
                  selectedCategory === category.id ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Share Poster Dialog */}
      {selectedPrompt && (
        <SharePosterDialog
          open={sharePosterOpen}
          onOpenChange={setSharePosterOpen}
          title={selectedPrompt.title}
          content={selectedPrompt.source_prompt}
        />
      )}

      <AlertDialog open={forkDialogOpen} onOpenChange={(open) => {
        setForkDialogOpen(open)
        if (!open) {
          setPromptToFork(null)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Prompts.confirmFork')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Prompts.forkMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setForkDialogOpen(false)
              setPromptToFork(null)
            }}>{t('Prompts.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFork}>{t('Prompts.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
