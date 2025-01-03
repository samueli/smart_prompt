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

interface Prompt {
  id: string
  title: string
  tags: string
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

  const fetchMyPrompts = async () => {
    if (!t) return

    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.fetchError)
      }
      setMyPrompts(result.data)
    } catch (error) {
      toast.error(t.fetchError, {
        description: error instanceof Error ? error.message : t.fetchError
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
        description: error instanceof Error ? error.message : t.fetchError
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
      const prompt = myPrompts.find(p => p.id === id)
      if (!prompt) return

      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${id}/public`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_public: prompt.is_public === 1 ? 0 : 1 })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.updateError)
      }

      setMyPrompts(prompts =>
        prompts.map(p =>
          p.id === id ? { ...p, is_public: p.is_public === 1 ? 0 : 1 } : p
        )
      )
      toast.success(t.updateSuccess)
    } catch (error) {
      toast.error(t.updateError, {
        description: error instanceof Error ? error.message : t.updateError
      })
    }
  }

  const handleEdit = (id: string) => {
    const prompt = myPrompts.find(p => p.id === id)
    if (prompt) {
      const parsedTags = prompt.tags ? JSON.parse(prompt.tags) : []
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
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.deleteError)
      }

      setMyPrompts(prompts => prompts.filter(p => p.id !== id))
      toast.success(t.deleteSuccess)
    } catch (error) {
      toast.error(t.deleteError, {
        description: error instanceof Error ? error.message : t.deleteError
      })
    }
  }

  const handleEditTags = (id: string) => {
    const prompt = myPrompts.find(p => p.id === id)
    if (prompt) {
      const parsedTags = prompt.tags ? JSON.parse(prompt.tags) : []
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
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...selectedPrompt,
          tags: JSON.stringify(tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update tags')
      }

      toast.success(t.updateSuccess)
      fetchMyPrompts()
    } catch (error) {
      console.error('Error updating tags:', error)
      toast.error(t.updateFailed)
    }
  }

  const filterPrompts = (prompts: Prompt[]) => {
    return prompts.filter(prompt => {
      const matchesSearch = searchQuery
        ? (prompt.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prompt.source_prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      try {
        const promptTags = JSON.parse(prompt.tags || '[]');
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

  const availableTags = useMemo(() => 
    Array.from(new Set(myPrompts.flatMap(prompt => {
      try {
        return JSON.parse(prompt.tags || '[]');
      } catch (e) {
        console.error('Error parsing tags:', e);
        return [];
      }
    }))).sort()
  , [myPrompts])

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
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          tags: JSON.stringify(data.tags)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update prompt')
      }

      toast.success(t.updateSuccess)
      fetchMyPrompts()
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast.error(t.updateFailed)
    }
  }

  if (!t) return null

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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMyPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.source_prompt}
                    optimizedContent={prompt.optimized_prompt}
                    isPublic={prompt.is_public === 1}
                    tags={JSON.parse(prompt.tags)}
                    updatedAt={prompt.update_time}
                    onShare={handleShare}
                    onTogglePublic={handleTogglePublic}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onEditTags={handleEditTags}
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublicPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.source_prompt}
                    optimizedContent={prompt.optimized_prompt}
                    isPublic={true}
                    tags={JSON.parse(prompt.tags)}
                    updatedAt={prompt.update_time}
                    onShare={handleShare}
                    onTogglePublic={undefined}
                    onEdit={undefined}
                    onDelete={undefined}
                    onEditTags={undefined}
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
          if (!t) return

          try {
            const token = localStorage.getItem('userToken')
            if (!token) {
              toast.error(t.tokenRequired)
              return
            }

            const response = await fetch(`${API_BASE_URL}/api/prompts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
            toast.success(t.createSuccess)
          } catch (error) {
            toast.error(t.createError, {
              description: error instanceof Error ? error.message : t.createError
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