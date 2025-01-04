import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { Shield, RefreshCw, Target } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/contexts/LocaleContext'
import { useBaseModel } from '@/contexts/BaseModelContext'
import { ModelSelectDialog } from '@/components/model-select-dialog'
import models from '@/config/models.json'

export default function Settings() {
  const { messages } = useLocale()
  const { baseModel, setBaseModel } = useBaseModel()
  const t = messages?.Settings
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 从本地存储加载 token
    const savedToken = localStorage.getItem('userToken')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const handleGenerateToken = () => {
    const newToken = uuidv4()
    setToken(newToken)
  }

  const handleSave = async () => {
    if (!token || token.length < 32) {
      toast.error(t?.invalidToken, { duration: 3000 })
      return
    }

    try {
      setLoading(true)
      // 保存到本地存储
      localStorage.setItem('userToken', token)
      // 添加一个短暂的延迟，让用户能看到保存中的状态
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(t?.saveSuccess, { duration: 3000 })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error(t?.saveError, { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  if (!messages) return null

  const getModelName = (modelId: string): string => {
    const model = (models as any).domestic[modelId] || (models as any).overseas[modelId]
    return model ? model.name : modelId
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t?.title}
            </CardTitle>
            <CardDescription>
              {t?.tokenDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t?.tokenSecurityTip}
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateToken}
                  title={t?.generateToken}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
              >
                {loading ? messages?.Common.saving : messages?.Common.save}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <CardTitle>{t?.baseModel.title}</CardTitle>
            </div>
            <CardDescription>{t?.baseModel.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {t.currentModel}: {getModelName(baseModel)}
              </div>
              <ModelSelectDialog onSelect={setBaseModel}>
                <Button variant="outline" size="sm">
                  {t.changeModel}
                </Button>
              </ModelSelectDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
