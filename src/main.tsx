import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './i18n/config'
import { LocaleProvider } from './contexts/LocaleContext'

// 启用 React Router v7 的 future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter {...router}>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)