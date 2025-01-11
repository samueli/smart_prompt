import { Prompt } from "@/types/prompt"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{prompt.title}</CardTitle>
        <div className="flex gap-2 mt-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" style={{ 
              borderColor: tag.color,
              color: tag.color 
            }}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {prompt.content}
        </p>
        <div className="text-xs text-muted-foreground mt-4">
          Updated {formatDate(prompt.updatedAt)}
        </div>
      </CardContent>
    </Card>
  )
} 