export type Tag = {
  id: string
  name: string
  color?: string
}

export type Prompt = {
  id: string
  title: string
  content: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
} 