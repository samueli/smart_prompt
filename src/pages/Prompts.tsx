import { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { PromptCard } from '@/components/prompt-card'
import { PromptDialog } from '@/components/prompt-dialog'
import { TagDialog } from '@/components/tag-dialog'
import { useLocale } from '@/contexts/LocaleContext'
import { API_BASE_URL } from '@/config/env'
import { Plus, Search } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTokenCheck } from '@/hooks/useTokenCheck'
import { useToken } from '@/hooks/useToken'
import { SharePosterDialog } from '@/components/share-poster-dialog'
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
import { TagSelect } from '@/components/tag-select'
import { SortSelect } from '@/components/sort-select'
import { Pagination } from '@/components/ui/pagination'

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
  qualityScore: number
}

export function Prompts() {
  const { messages } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [orderBy, setOrderBy] = useState('update_time')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [editingTagsPromptId, setEditingTagsPromptId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [sharePosterOpen, setSharePosterOpen] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const { token, getLatestToken } = useToken()

  const t = useMemo(() => messages?.Prompts, [messages])
  const commonT = useMemo(() => messages?.Common, [messages])
  const checkToken = useTokenCheck()

  // 合并所有初始化逻辑到一个 useEffect
  useEffect(() => {
    const initData = async () => {
      if (!t || !commonT) return;
      
      try {
        if (!checkToken(commonT.tokenRequired)) {
          const langPath = location.pathname.startsWith('/zh-CN') ? '/zh-CN' : '/en-US'
          navigate(`${langPath}/settings`)
          return
        }

        setLoading(true)
        const currentToken = localStorage.getItem('userToken')
        if (!currentToken) return;

        const response = await fetch(`${API_BASE_URL}/api/prompts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        })
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || t.fetchError)
        }
        const promptsWithQualityScore = result.data.map((prompt: Prompt) => ({
          ...prompt,
          qualityScore: Math.floor(Math.random() * 11)
        }))
        setMyPrompts(promptsWithQualityScore)
      } catch (error) {
        toast.error(t.fetchError, {
          description: error instanceof Error ? error.message : t.fetchError,
          duration: 3000
        })
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [t, commonT, token]) // 只在翻译和 token 变化时重新加载

  const handleShare = (id: string) => {
    const prompt = myPrompts.find(p => p.id === id)
    if (prompt) {
      setSelectedPrompt(prompt)
      setSharePosterOpen(true)
    }
  }

  const handleTogglePublic = async (id: string) => {
    if (!t) return

    try {
      const prompt = myPrompts.find(p => p.id === id)
      if (!prompt) return

      setSelectedPrompt(prompt)
      setShowPublishDialog(true)
    } catch (error) {
      console.error('Error toggling public status:', error)
      toast.error(t.updateError, {
        description: error instanceof Error ? error.message : t.updateError,
        duration: 3000
      })
    }
  }

  const handleConfirmPublish = async () => {
    if (!t || !selectedPrompt) return

    try {
      if (!checkToken(commonT.tokenRequired)) {
        return
      }

      // 显示功能开发中的提示
      toast.info(t.publishSuccess, {
        duration: 3000
      })

      // 关闭弹窗并清理状态
      setShowPublishDialog(false)
      setSelectedPrompt(null)
    } catch (error) {
      console.error('Error toggling public status:', error)
      toast.error(t.updateError, {
        description: error instanceof Error ? error.message : t.updateError,
        duration: 3000
      })
    }
  }

  const handleEdit = (id: string) => {
    const prompt = myPrompts.find(p => p.id === id)
    if (prompt) {
      const parsedTags = Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]');
      setSelectedPrompt({
        ...prompt,
        tags: parsedTags
      })
      setEditDialogOpen(true)
    }
  }

  const handleDelete = async (id: string) => {
    if (!t) return

    try {
      const latestToken = getLatestToken()
      console.log('Deleting prompt with latest token:', latestToken)
      const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${latestToken}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.deleteError)
      }

      setMyPrompts(prompts => prompts.filter(p => p.id !== id))
      toast.success(t.deleteSuccess, { duration: 3000 })
    } catch (error) {
      toast.error(t.deleteError, {
        description: error instanceof Error ? error.message : t.deleteError,
        duration: 3000
      })
    }
  }

  const handleEditTags = (id: string) => {
    const prompt = myPrompts.find(p => p.id === id)
    if (prompt) {
      const parsedTags = Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]');
      setSelectedPrompt({
        ...prompt,
        tags: parsedTags
      })
      setTagDialogOpen(true)
    }
  }

  const handleUpdateTags = async (tags: string[]) => {
    if (!selectedPrompt) return

    try {
      const latestToken = getLatestToken()
      console.log('Updating tags with latest token:', latestToken)
      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${latestToken}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify({
          ...selectedPrompt,
          tags: JSON.stringify(tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update tags')
      }

      toast.success(t.updateSuccess, { duration: 3000 })
      // fetchMyPrompts()
    } catch (error) {
      console.error('Error updating tags:', error)
      toast.error(t.updateFailed, { duration: 3000 })
    }
  }

  const handleGoToEvaluate = (id: string) => {
    console.log("Go to evaluate:", id)
  }

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    
    myPrompts.forEach(prompt => {
      try {
        const tags = typeof prompt.tags === 'string' 
          ? JSON.parse(prompt.tags || '[]')
          : prompt.tags || [];
        tags.forEach((tag: string) => tagSet.add(tag));
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    });
    
    return Array.from(tagSet).sort();
  }, [myPrompts]);

  const filterPrompts = (prompts: Prompt[]) => {
    return prompts.filter(prompt => {
      const matchesSearch = searchQuery
        ? (prompt.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prompt.source_prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      try {
        const promptTags = Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]');
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => promptTags.includes(tag));
        
        return matchesSearch && matchesTags;
      } catch (e) {
        console.error('Error parsing tags:', e);
        return matchesSearch;
      }
    }).sort((a, b) => {
      const aValue = a[orderBy as keyof Prompt] || '';
      const bValue = b[orderBy as keyof Prompt] || '';
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  const filteredMyPrompts = useMemo(() => filterPrompts(myPrompts), [myPrompts, searchQuery, selectedTags, orderBy, order])

  const sortOptions = useMemo(() => [
    { value: 'update_time', label: t?.sortByUpdateTime || '更新时间' },
    { value: 'create_time', label: t?.sortByCreateTime || '创建时间' },
    { value: 'title', label: t?.sortByTitle || '标题' }
  ], [t])

  const handleUpdate = async (data: {
    title: string
    source_prompt: string
    optimized_prompt: string
    is_public: number
    tags: string[]
  }) => {
    if (!selectedPrompt) return

    try {
      const latestToken = getLatestToken()
      console.log('Updating prompt with latest token:', latestToken)
      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${latestToken}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify({
          ...data,
          tags: JSON.stringify(data.tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update prompt')
      }

      toast.success(t.updateSuccess, { duration: 3000 })
      // fetchMyPrompts()
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast.error(t.updateFailed, { duration: 3000 })
    }
  }

  const handleCreate = async (data: {
    title: string
    source_prompt: string
    optimized_prompt: string
    is_public: number
    tags: string[]
  }) => {
    if (!t) return

    try {
      const latestToken = getLatestToken()
      console.log('Creating prompt with latest token:', latestToken)
      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${latestToken}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify({
          ...data,
          tags: JSON.stringify(data.tags)
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.createError)
      }

      await fetchMyPrompts()
      setCreateDialogOpen(false)
      toast.success(t.createSuccess, { duration: 3000 })
    } catch (error) {
      toast.error(t.createError, {
        description: error instanceof Error ? error.message : t.createError,
        duration: 3000
      })
    }
  }

  if (!t || !commonT) return null

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t.pageTitle}</h1>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t.create}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 items-center w-full md:w-auto">
          <TagSelect
            className="w-full md:w-48"
            placeholder={t.filterByTags}
            options={availableTags}
            value={selectedTags}
            onChange={setSelectedTags}
          />
          <SortSelect
            className="w-full md:w-48"
            options={sortOptions}
            value={orderBy}
            order={order}
            onValueChange={setOrderBy}
            onOrderChange={setOrder}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : filteredMyPrompts.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMyPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              content={prompt.source_prompt}
              optimizedContent={prompt.optimized_prompt}
              isPublic={prompt.is_public === 1}
              tags={Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]')}
              updatedAt={prompt.update_time}
              qualityScore={prompt.qualityScore}
              onShare={handleShare}
              onTogglePublic={handleTogglePublic}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEditTags={handleEditTags}
              onOptimize={handleGoToEvaluate}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="text-center">{t.noPrompts}</div>
        </Card>
      )}

      <AlertDialog open={showPublishDialog} onOpenChange={(open) => {
        setShowPublishDialog(open)
        if (!open) {
          setSelectedPrompt(null)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmPublish}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPrompt?.is_public === 1 ? t.unpublishMessage : t.publishMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowPublishDialog(false)
              setSelectedPrompt(null)
            }}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              {selectedPrompt?.is_public === 1 ? t.unpublish : t.publish}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PromptDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title={t.create}
        onSubmit={handleCreate}
      />

      <PromptDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={t.edit}
        initialData={selectedPrompt || undefined}
        onSubmit={handleUpdate}
      />

      <TagDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        initialTags={selectedPrompt?.tags || []}
        onSubmit={handleUpdateTags}
      />

      {selectedPrompt && (
        <SharePosterDialog
          open={sharePosterOpen}
          onOpenChange={setSharePosterOpen}
          title={selectedPrompt.title}
          content={selectedPrompt.source_prompt}
        />
      )}
    </div>
  )
}