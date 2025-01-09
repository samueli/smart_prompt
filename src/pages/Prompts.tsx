import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocale } from '@/contexts/LocaleContext'
import { API_BASE_URL } from '@/config/env'
import { PromptCard } from '@/components/prompt-card'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TagSelect } from '@/components/tag-select'
import { SortSelect } from '@/components/sort-select'
import { Pagination } from '@/components/ui/pagination'
import { PromptDialog } from '@/components/prompt-dialog'
import { TagDialog } from '@/components/tag-dialog'
import { Plus, User2, Globe2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTokenCheck } from '@/hooks/useTokenCheck'

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
}

export function Prompts() {
  const { messages } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([])
  const [publicPrompts, setPublicPrompts] = useState<Prompt[]>([])
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

  const t = useMemo(() => messages?.Prompts, [messages])
  const commonT = useMemo(() => messages?.Common, [messages])
  const checkToken = useTokenCheck()

  const fetchMyPrompts = async () => {
    if (!t || !commonT) return

    try {
      if (!checkToken(commonT.tokenRequired)) {
        // 获取当前语言路径
        const langPath = location.pathname.startsWith('/zh-CN') ? '/zh-CN' : '/en-US'
        // 跳转到设置页面
        navigate(`${langPath}/settings`)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      })
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.fetchError)
      }
      setMyPrompts(result.data)
    } catch (error) {
      toast.error(t.fetchError, {
        description: error instanceof Error ? error.message : t.fetchError,
        duration: 3000
      })
    }
  }

  const fetchPublicPrompts = async () => {
    if (!t) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts/public`)
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.fetchError)
      }
      setPublicPrompts(result.data)
    } catch (error) {
      toast.error(t.fetchError, {
        description: error instanceof Error ? error.message : t.fetchError,
        duration: 3000
      })
    }
  }

  useEffect(() => {
    if (t) {
      const init = async () => {
        setLoading(true)
        await Promise.all([fetchMyPrompts(), fetchPublicPrompts()])
        setLoading(false)
      }
      init()
    }
  }, [t])

  const handleShare = (id: string) => {
    // TODO: 实现分享功能
    console.log("Share prompt:", id)
  }

  const handleTogglePublic = async (id: string) => {
    if (!t) return

    try {
      if (!checkToken(commonT.tokenRequired)) {
        return
      }

      const prompt = myPrompts.find(p => p.id === id)
      if (!prompt) return

      // 显示功能开发中的提示
      toast.info(t.publishMessage || 'The prompt is under review and will be public after approval',
        {
          duration: 3000
        }
      )

      // 临时更新 UI 状态
      setMyPrompts(prompts =>
        prompts.map(p =>
          p.id === id ? { ...p, is_public: p.is_public === 1 ? 0 : 1 } : p
        )
      )
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
      if (!checkToken(commonT.tokenRequired)) {
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
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
      if (!checkToken(commonT.tokenRequired)) {
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          ...selectedPrompt,
          tags: JSON.stringify(tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update tags')
      }

      toast.success(t.updateSuccess, { duration: 3000 })
      fetchMyPrompts()
    } catch (error) {
      console.error('Error updating tags:', error)
      toast.error(t.updateFailed, { duration: 3000 })
    }
  }

  const handleGoToEvaluate = (id: string) => {
    console.log("Go to evaluate:", id)
  }

  if (!t || !commonT) return null

  const availableTags = useMemo(() => {
    const allPrompts = [...myPrompts, ...publicPrompts];
    const tagSet = new Set<string>();
    
    allPrompts.forEach(prompt => {
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
  }, [myPrompts, publicPrompts]);

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
  const filteredPublicPrompts = useMemo(() => filterPrompts(publicPrompts), [publicPrompts, searchQuery, selectedTags, orderBy, order])

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
      if (!checkToken(commonT.tokenRequired)) {
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          ...data,
          tags: JSON.stringify(data.tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update prompt')
      }

      toast.success(t.updateSuccess, { duration: 3000 })
      fetchMyPrompts()
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast.error(t.updateFailed, { duration: 3000 })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{t.pageTitle}</h1>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 rounded-md border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TagSelect
              availableTags={availableTags}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
            />
            <SortSelect
              options={sortOptions}
              value={orderBy}
              order={order}
              onValueChange={setOrderBy}
              onOrderChange={setOrder}
            />
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.new}
        </Button>
      </div>

      <Tabs defaultValue="my" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="my" className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            {t.myPrompts}
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            {t.publicPrompts}
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="my">
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
          </TabsContent>

          <TabsContent value="public">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            ) : filteredPublicPrompts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublicPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.source_prompt}
                    optimizedContent={prompt.optimized_prompt}
                    isPublic={true}
                    tags={Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]')}
                    updatedAt={prompt.update_time}
                    onShare={handleShare}
                    onTogglePublic={undefined}
                    onEdit={undefined}
                    onDelete={undefined}
                    onEditTags={undefined}
                    onOptimize={undefined}
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6">
                <div className="text-center">{t.noPublicPrompts}</div>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>

      <PromptDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title={t.create}
        onSubmit={async (data) => {
          if (!t || !commonT) return

          try {
            if (!checkToken(commonT.tokenRequired)) {
              return
            }

            const response = await fetch(`${API_BASE_URL}/api/prompts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
              },
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
        }}
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
    </div>
  )
}