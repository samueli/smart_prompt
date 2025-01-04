import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { 
  Wand2, 
  Pencil, 
  Copy, 
  Save, 
  LayoutTemplate, 
  Settings2, 
  Target,
  Code,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { API_BASE_URL } from '@/config/env'
import { useSearchParams, useNavigate } from "react-router-dom"

interface Framework {
  code: string
  cn_name: string
  en_name: string
  cn_description: string
  en_description: string
}

export function Optimizer() {
  const { messages: t, locale } = useLocale()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const promptId = searchParams.get("promptId")
  const sourcePromptFromUrl = searchParams.get("sourcePrompt")
  const originalTitle = searchParams.get("title")
  
  const [sourcePrompt, setSourcePrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [scenario, setScenario] = useState('general')
  const [framework, setFramework] = useState('')
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [isFrameworksLoading, setIsFrameworksLoading] = useState(false)
  const [outputFormat, setOutputFormat] = useState('plaintext')
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const toastIdRef = useRef<string | number | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    if (sourcePromptFromUrl) {
      setSourcePrompt(decodeURIComponent(sourcePromptFromUrl))
    }
  }, [sourcePromptFromUrl])

  useEffect(() => {
    const fetchFrameworks = async () => {
      setIsFrameworksLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/prompts/optimize/frameworks`)
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || t.Common.unknownError)
        }
        setFrameworks(result.data)
        // 设置默认选中第一个框架
        if (result.data.length > 0) {
          setFramework(result.data[0].code)
        }
      } catch (error) {
        toast.error(t.Common.loadFailed, {
          description: error instanceof Error ? error.message : t.Common.unknownError,
          duration: 3000
        })
      } finally {
        setIsFrameworksLoading(false)
      }
    }

    fetchFrameworks()
  }, [t.Common.loadFailed, t.Common.unknownError])

  if (!t) return null

  const showFrameworkTip = (framework: string) => {
    const tip = t.Optimizer.frameworkTips?.[framework]
    if (tip) {
      toast.info(tip, { duration: 3000 })
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    const toastId = toast.loading(t.Optimizer.optimizing, {
      duration: Infinity
    })

    try {
      // 获取token
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.Common.tokenRequired, { duration: 3000 })
        return
      }

      const selectedFramework = frameworks.find(f => f.code === framework)
      if (!selectedFramework) {
        throw new Error('未选择优化框架')
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inputPrompt: sourcePrompt,
          businessScenario: scenario,
          optimizationFramework: selectedFramework.code,
          outputFormat: outputFormat,
          promptId,
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.Common.unknownError)
      }

      setOptimizedPrompt(result.data.optimizedPrompt)
      toast.success(t.Common.optimizeSuccess, {
        id: toastId,
        duration: 3000
      })
    } catch (error) {
      toast.error(t.Common.optimizeFailed, {
        id: toastId,
        description: error instanceof Error ? error.message : t.Common.unknownError,
        duration: 3000
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt)
      toast.success(t.Common.copySuccess, { duration: 3000 })
    } catch (error) {
      toast.error(t.Common.copyFailed, { duration: 3000 })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const toastId = toast.loading(t.Common.saving, {
      duration: Infinity
    })

    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(t.Common.tokenRequired, { duration: 3000 })
        return
      }

      const timestamp = format(new Date(), 'yyyyMMddHHmmss')
      const title = promptId 
        ? originalTitle // 更新时使用原标题
        : `${t.Optimizer.scenarios[scenario]}_${frameworks.find(f => f.code === framework)?.[locale === 'zh-CN' ? 'cn_name' : 'en_name']}_${timestamp}` // 新建时生成标题

      // 如果是从提示词卡片点击优化进入的，执行更新操作
      const method = promptId ? 'PUT' : 'POST'
      const url = promptId 
        ? `${API_BASE_URL}/api/prompts/${promptId}`
        : `${API_BASE_URL}/api/prompts`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title, // 始终传入标题
          tags: '[]',
          creator: 'user',
          source_prompt: sourcePrompt,
          optimized_prompt: optimizedPrompt,
          is_public: 0
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || t.Common.saveFailed)
      }

      toast.success(promptId ? t.updateSuccess : t.Common.saved, {
        id: toastId,
        duration: 3000
      })
      // 延迟一下再跳转，让用户看到成功提示
      setTimeout(() => {
        navigate(`/${locale}/prompts`)
      }, 1000)
    } catch (error) {
      toast.error(t.Common.saveFailed, {
        id: toastId,
        description: error instanceof Error ? error.message : t.Common.unknownError,
        duration: 3000
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateClick = () => {
    if (isSaving) return
    handleSave()
    setIsUpdateDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            {t.Optimizer.title}
          </h2>
          <Textarea
            value={sourcePrompt}
            onChange={(e) => setSourcePrompt(e.target.value)}
            placeholder={t.Optimizer.placeholder}
            className="min-h-[200px]"
          />
          <div className="mt-1 text-sm text-muted-foreground">
            {t.tokenCount}: {sourcePrompt.length}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.Optimizer.scenario}
            </label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger>
                <SelectValue placeholder={t.Optimizer.scenarios.general} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.Optimizer.scenarios).map(([value, label]) => (
                  <SelectItem 
                    key={value} 
                    value={value}
                    className="cursor-pointer hover:bg-accent/50"
                  >
                    {label as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                {t.Optimizer.framework}
              </label>
            </div>
            <div className="relative">
              <Select 
                value={framework} 
                onValueChange={setFramework}
                disabled={isFrameworksLoading}
              >
                <SelectTrigger>
                  <SelectValue>
                    {isFrameworksLoading ? (
                      t.Common.loading
                    ) : (
                      frameworks.find(f => f.code === framework)?.[locale === 'zh-CN' ? 'cn_name' : 'en_name'] || t.Common.loading
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((f) => (
                    <HoverCard key={f.code}>
                      <HoverCardTrigger asChild>
                        <SelectItem 
                          value={f.code}
                          className="cursor-pointer hover:bg-accent/50"
                        >
                          {locale === 'zh-CN' ? f.cn_name : f.en_name}
                        </SelectItem>
                      </HoverCardTrigger>
                      <HoverCardContent 
                        className="w-[360px] p-4" 
                        align="start"
                        side="right"
                        sideOffset={10}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-base">
                            {locale === 'zh-CN' ? f.cn_name : f.en_name}
                          </h4>
                          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                            {locale === 'zh-CN' ? f.cn_description : f.en_description}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              {t.Optimizer.outputFormat}
            </label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger>
                <SelectValue placeholder={t.Optimizer.outputFormats.plaintext} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.Optimizer.outputFormats).map(([value, label]) => (
                  <SelectItem 
                    key={value} 
                    value={value}
                    className="cursor-pointer hover:bg-accent/50"
                  >
                    {label as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing || !sourcePrompt || isFrameworksLoading}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isOptimizing ? t.Optimizer.optimizing : t.Optimizer.optimize}
          </Button>
        </div>

        {optimizedPrompt && (
          <div>
            <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t.Optimizer.result}
            </h2>
            <Textarea
              value={optimizedPrompt}
              readOnly
              placeholder={t.Optimizer.resultPlaceholder}
              className="min-h-[200px]"
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                {t.Common.copy}
              </Button>
              {promptId ? (
                <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? t.Common.saving : t.Common.update}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.Common.update}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.Optimizer.confirmUpdateMessage}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsUpdateDialogOpen(false)}>
                        {t.Common.cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave} disabled={isSaving}>
                        {isSaving ? t.Common.saving : t.Common.confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? t.Common.saving : t.Common.save}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}