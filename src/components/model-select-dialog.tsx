import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Search, ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import models from '@/config/models.json'

interface ModelSelectDialogProps {
  children: React.ReactNode
  onSelect: (value: string) => void
  multiSelect?: boolean
  selectedModels?: string[]
}

export function ModelSelectDialog({ children, onSelect, multiSelect = false, selectedModels = [] }: ModelSelectDialogProps) {
  const { messages } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)

  if (!messages) return null

  const t = messages.ModelSelect

  const filterModels = (models: any, category: 'domestic' | 'overseas') => {
    return Object.entries(models[category])
      .filter(([_, model]: [string, any]) => {
        const searchLower = searchTerm.toLowerCase()
        return model.name.toLowerCase().includes(searchLower) ||
          model.provider.toLowerCase().includes(searchLower)
      })
  }

  const renderTable = (category: 'domestic' | 'overseas') => {
    const filteredModels = filterModels(models, category)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{t.modelName}</TableHead>
                <TableHead>{t.contextLength}</TableHead>
                <TableHead>{t.price}</TableHead>
                <TableHead className="w-[100px]">{t.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map(([key, model]: [string, any]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {model.name}
                      {model.multimodal && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {t.multimodal}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{model.context_length.toLocaleString()}</TableCell>
                  <TableCell>
                    ${model.input_price}/1K ({t.input})<br />
                    ${model.output_price}/1K ({t.output})
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={selectedModels.includes(key) ? "secondary" : "outline"}
                      size="sm"
                      disabled={category === 'overseas'}
                      onClick={() => {
                        onSelect(key)
                        if (!multiSelect) {
                          setOpen(false)
                        }
                      }}
                    >
                      {category === 'overseas' ? t.unavailable : (selectedModels.includes(key) ? t.selected : t.select)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="domestic">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="domestic">{t.domestic}</TabsTrigger>
            <TabsTrigger value="overseas">{t.overseas}</TabsTrigger>
          </TabsList>
          <TabsContent value="domestic" className="mt-4">
            {renderTable('domestic')}
          </TabsContent>
          <TabsContent value="overseas" className="mt-4">
            {renderTable('overseas')}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
