import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home } from '@/pages/Home'
import { Prompts } from '@/pages/Prompts'
import { Optimizer } from '@/pages/Optimizer'
import { Evaluator } from '@/pages/Evaluator'
import { Market } from '@/pages/Market'
import PluginsPage from '@/pages/plugins'
import Settings from '@/pages/Settings'
import { useLocale } from '@/contexts/LocaleContext'
import { useEffect } from 'react'

export function Router() {
  const { locale, setLocale } = useLocale()
  const location = useLocation()

  // 从 URL 中获取语言设置
  useEffect(() => {
    const path = location.pathname
    const urlLocale = path.startsWith('/zh-CN') ? 'zh-CN' : 'en-US'
    if (urlLocale !== locale) {
      setLocale(urlLocale)
    }
  }, [location.pathname])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={`/${locale}`} replace />} />
        
        {/* 英文路由 */}
        <Route path="/en-US">
          <Route index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/new" element={<Prompts />} />
          <Route path="optimizer" element={<Optimizer />} />
          <Route path="evaluator" element={<Evaluator />} />
          <Route path="plugins" element={<PluginsPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 中文路由 */}
        <Route path="/zh-CN">
          <Route index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/new" element={<Prompts />} />
          <Route path="optimizer" element={<Optimizer />} />
          <Route path="evaluator" element={<Evaluator />} />
          <Route path="plugins" element={<PluginsPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 重定向未匹配的路由 */}
        <Route path="*" element={<Navigate to={`/${locale}`} replace />} />
      </Routes>
    </Layout>
  )
}