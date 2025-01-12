import { useState, useEffect, useCallback } from 'react'

export function useToken() {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('userToken')
    console.log('Initial token:', storedToken)
    return storedToken
  })

  const updateToken = useCallback((newToken: string | null) => {
    console.log('Updating token:', newToken)
    if (newToken) {
      localStorage.setItem('userToken', newToken)
    } else {
      localStorage.removeItem('userToken')
    }
    setToken(newToken)
  }, [])

  const getLatestToken = useCallback(() => {
    const currentToken = localStorage.getItem('userToken')
    if (currentToken !== token) {
      console.log('Token mismatch, updating from:', token, 'to:', currentToken)
      updateToken(currentToken)
    }
    return currentToken
  }, [token, updateToken])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userToken') {
        console.log('Storage event - new token:', e.newValue)
        updateToken(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [updateToken])

  return { token, updateToken, getLatestToken }
}
