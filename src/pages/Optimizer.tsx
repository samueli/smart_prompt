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
  Wand2, 
  Pencil, 
  Copy, 
  Save, 
  LayoutTemplate, 
  Settings2, 
  Target,
  Code,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { API_BASE_URL } from '@/config/env'
import { useSearchParams, useNavigate } from "react-router-dom"

export function Optimizer() {
  const { messages, locale } = useLocale()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const promptId = searchParams.get("promptId")
  const sourcePrompt = searchParams.get("sourcePrompt")
  const originalTitle = searchParams.get("title")

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [sourceText, setSourceText] = useState<string>("")
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [scenario, setScenario] = useState('general')
  const [framework, setFramework] = useState('promptWizard')
  const [outputFormat, setOutputFormat] = useState('plaintext')
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const toastIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    if (sourcePrompt) {
      setSourceText(decodeURIComponent(sourcePrompt))
    }
  }, [sourcePrompt])

  if (!messages) return null
  
  const t = messages.Optimizer

  const showFrameworkTip = (framework: string) => {
    const tip = t.frameworkTips[framework]
    if (tip) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }
      
      toastIdRef.current = toast(tip, {
        duration: 5000,
        position: 'bottom-center',
        onDismiss: () => {
          toastIdRef.current = null
        }
      })
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    const toastId = toast.loading(t.optimizing, {
      position: 'bottom-center',
      duration: Infinity
    })

    try {
      // 获取token
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(messages.Common.tokenRequired)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/prompts/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inputPrompt: sourceText,
          businessScenario: scenario,
          optimizationFramework: framework,
          outputFormat: outputFormat,
          promptId, // 添加 promptId 到请求中
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || messages.Common.unknownError)
      }

      setOptimizedPrompt(result.data.optimizedPrompt)
      toast.success(messages.Common.optimizeSuccess, {
        id: toastId,
        duration: 3000
      })
    } catch (error) {
      toast.error(messages.Common.optimizeFailed, {
        id: toastId,
        description: error instanceof Error ? error.message : messages.Common.unknownError
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt)
      toast.success(messages.Common.copySuccess)
    } catch (error) {
      toast.error(messages.Common.copyFailed)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        toast.error(messages.Common.tokenRequired)
        return
      }

      const timestamp = format(new Date(), 'yyyyMMddHHmmss')
      const title = promptId 
        ? originalTitle // 更新时使用原标题
        : `${t.scenarios[scenario]}_${t.frameworks[framework]}_${timestamp}` // 新建时生成标题

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
          source_prompt: sourceText,
          optimized_prompt: optimizedPrompt,
          is_public: 0
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || messages.Common.saveFailed)
      }

      toast.success(promptId ? t.updateSuccess : messages.Common.saved)
      // 延迟一下再跳转，让用户看到成功提示
      setTimeout(() => {
        navigate(`/${locale}/prompts`)
      }, 1000)
    } catch (error) {
      toast.error(messages.Common.saveFailed, {
        description: error instanceof Error ? error.message : messages.Common.unknownError
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
            {t.input.title}
          </h2>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t.input.placeholder}
            className="h-32"
          />
          <div className="mt-1 text-sm text-muted-foreground">
            {t.tokenCount}: {sourceText.length}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.scenario}
            </label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger>
                <SelectValue placeholder={t.scenarios.general} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.scenarios).map(([value, label]) => (
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
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              {t.framework}
            </label>
            <Select value={framework} onValueChange={(value) => {
              setFramework(value)
              showFrameworkTip(value)
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t.frameworks.promptWizard} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.frameworks).map(([value, label]) => (
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
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              {t.outputFormat}
            </label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger>
                <SelectValue placeholder={t.outputFormats.plaintext} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.outputFormats).map(([value, label]) => (
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
            disabled={isOptimizing || !sourceText}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isOptimizing ? t.optimizing : t.optimize}
          </Button>
        </div>

        {optimizedPrompt && (
          <div>
            <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t.result}
            </h2>
            <Textarea
              value={optimizedPrompt}
              readOnly
              placeholder={t.resultPlaceholder}
              className="h-32"
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                {t.copy}
              </Button>
              {promptId ? (
                <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {t.update}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.confirmUpdate}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.confirmUpdateMessage}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsUpdateDialogOpen(false)}>
                        {messages.Common.cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleUpdateClick} disabled={isSaving}>
                        {isSaving ? messages.Common.saving : messages.Common.confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? messages.Common.saving : t.save}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}