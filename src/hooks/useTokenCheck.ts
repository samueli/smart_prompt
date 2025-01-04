import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export function useTokenCheck() {
  const navigate = useNavigate()
  const location = useLocation()

  const checkToken = (errorMessage: string) => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      toast.error(errorMessage, { duration: 3000 })
      const langPath = location.pathname.startsWith('/zh-CN') ? '/zh-CN' : '/en-US'
      navigate(`${langPath}/settings`)
      return false
    }
    return true
  }

  return checkToken
}
