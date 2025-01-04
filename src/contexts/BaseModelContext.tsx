import React, { createContext, useContext, useState } from 'react'

interface BaseModelContextType {
  baseModel: string
  setBaseModel: (model: string) => void
}

const BaseModelContext = createContext<BaseModelContextType | undefined>(undefined)

export function BaseModelProvider({ children }: { children: React.ReactNode }) {
  const [baseModel, setBaseModel] = useState('chatglm_4')

  return (
    <BaseModelContext.Provider value={{ baseModel, setBaseModel }}>
      {children}
    </BaseModelContext.Provider>
  )
}

export function useBaseModel() {
  const context = useContext(BaseModelContext)
  if (context === undefined) {
    throw new Error('useBaseModel must be used within a BaseModelProvider')
  }
  return context
}
