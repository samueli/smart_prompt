import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Search, Tag, Layers, ChevronRight, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/contexts/LocaleContext'
import { API_BASE_URL } from '@/config/env'
import { PromptCard } from '@/components/prompt-card'
import { PROMPT_CATEGORIES, Category } from '@/config/categories'
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
  qualityScore?: number
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
  const [forkDialogOpen, setForkDialogOpen] = useState(false)
  const [promptToFork, setPromptToFork] = useState<{ title: string, source_prompt: string, optimized_prompt: string } | null>(null)

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
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
      // 为每个提示词添加随机质量分数
      const promptsWithQualityScore = result.data.map((prompt: Prompt) => ({
        ...prompt,
        qualityScore: Math.floor(Math.random() * 11) // 生成0-10的随机整数
      }))
      setPrompts(promptsWithQualityScore)
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

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesCategory = !selectedCategory || prompt.category === selectedCategory
      const matchesSearch = !searchQuery ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.source_prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]'))
          .some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [prompts, selectedCategory, searchQuery])

  return (
    <div className="container mx-auto py-6 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold mb-6">{t('Market.pageTitle')}</h1>
      <div className="flex flex-col md:flex-row gap-4 relative">
        {/* 左侧分类栏 */}
        <div className="flex-none w-full md:w-52">
          <div className="sticky top-0 z-30 flex flex-col gap-2 bg-background border-b md:border-none">
            <div className="flex items-center gap-2 p-3 md:px-0">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={t('Market.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 w-full h-9 text-sm"
                />
              </div>
            </div>

            {/* 移动端横向滑动类目 */}
            <div className="md:hidden overflow-x-auto flex gap-2 px-3 pb-3 no-scrollbar">
              <button
                key="all"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                  !selectedCategory ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-accent/50"
                )}
              >
                <Layers className="h-4 w-4" />
                {t('Market.allCategories')}
              </button>
              {PROMPT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                    selectedCategory === category.id ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-accent/50"
                  )}
                >
                  {category.icon && <category.icon className="h-4 w-4" />}
                  {category.name[locale]}
                </button>
              ))}
            </div>

            {/* 桌面端垂直类目列表 */}
            <div className="hidden md:block md:sticky md:top-4 space-y-3 py-3 bg-background">
              <div>
                <h2 className="mb-1.5 text-base font-semibold tracking-tight">{t('Market.categories')}</h2>
                <div className="space-y-0.5">
                  <button
                    key="all"
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors",
                      !selectedCategory ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                  >
                    <Layers className="h-4 w-4" />
                    {t('Market.allCategories')}
                  </button>
                  {PROMPT_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors",
                        selectedCategory === category.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                      )}
                    >
                      {category.icon && <category.icon className="h-4 w-4" />}
                      {category.name[locale]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-1.5 text-base font-semibold tracking-tight">{t('Market.popularTags')}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {['tag1', 'tag2', 'tag3'].map((tag) => (
                    <Badge
                      key={tag}
                      variant={searchQuery === tag ? "default" : "secondary"}
                      className="cursor-pointer text-sm px-2 py-0.5"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className="h-48 animate-pulse" />
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('Market.noPrompts')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  content={prompt.source_prompt}
                  optimizedContent={prompt.optimized_prompt}
                  tags={Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]')}
                  creator={prompt.creator}
                  updatedAt={prompt.update_time}
                  isPublic={prompt.is_public === 1}
                  qualityScore={prompt.qualityScore}
                  onShare={() => {
                    setSelectedPrompt(prompt)
                    setSharePosterOpen(true)
                  }}
                  onFork={async () => {
                    setSelectedPrompt(prompt)
                    setForkDialogOpen(true)
                  }}
                />
              ))}
            </div>
          )}
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
