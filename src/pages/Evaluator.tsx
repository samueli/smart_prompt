import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useBaseModel } from '@/contexts/BaseModelContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Target, BarChart3, Pencil, X, PlayCircle, Clock, Sparkles, CheckCircle2, Star } from 'lucide-react'
import { ModelSelectDialog } from '@/components/model-select-dialog'
import models from '@/config/models.json'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export function Evaluator() {
  const { messages } = useLocale()
  const { baseModel } = useBaseModel()
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [expectedResult, setExpectedResult] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  if (!messages) return null

  const t = messages.Evaluator

  const getModelName = (modelId: string): string => {
    const model = (models as any).domestic[modelId] || (models as any).overseas[modelId]
    return model ? model.name : modelId
  }

  const getRandomData = () => {
    return {
      time: Math.floor(Math.random() * 900 + 100), // 100-1000ms
      cost: (Math.random() * 0.05 + 0.01).toFixed(4), // $0.01-0.06
      creativity: (Math.random() * 2 + 8).toFixed(1), // 8.0-10.0
      accuracy: (Math.random() * 2 + 8).toFixed(1), // 8.0-10.0
      overall: (Math.random() * 2 + 8).toFixed(1), // 8.0-10.0
    }
  }

  const evaluationData = selectedModels.map(model => ({
    model,
    ...getRandomData()
  }))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              {t.demoTip || "本功能仅做演示，正在紧锣密鼓开发中，实际功能可能会有调整。"}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.baseModel}
            </label>
            <div className="text-base font-medium">{getModelName(baseModel)}</div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              {t.input.title}
            </h2>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.input.placeholder}
              className="h-32"
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t.expected.title}
            </h2>
            <Textarea
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder={t.expected.placeholder}
              className="h-32"
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.modelSelection.title}
            </h2>
            <div className="space-y-4">
              <ModelSelectDialog 
                onSelect={(value) => {
                  if (!selectedModels.includes(value)) {
                    setSelectedModels([...selectedModels, value])
                  }
                }}
                multiSelect
                selectedModels={selectedModels}
              >
                <Button variant="outline">
                  {t.modelSelection.addModel}
                </Button>
              </ModelSelectDialog>

              {selectedModels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedModels.map((model) => (
                    <div
                      key={model}
                      className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                    >
                      {getModelName(model)}
                      <button
                        onClick={() => setSelectedModels(selectedModels.filter(m => m !== model))}
                        className="hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Button
              onClick={() => setIsEvaluating(true)}
              disabled={isEvaluating || !prompt || !expectedResult || selectedModels.length === 0}
              className="w-full"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {isEvaluating ? t.evaluating : t.startEvaluation}
            </Button>
          </div>

          {/* 评测结果表格 */}
          {isEvaluating && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.results.model}</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {t.results.time}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        ${t.results.cost}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        {t.results.creativity}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {t.results.accuracy}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {t.results.overall}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationData.map((result) => (
                    <TableRow key={result.model}>
                      <TableCell>{getModelName(result.model)}</TableCell>
                      <TableCell>{result.time}ms</TableCell>
                      <TableCell>${result.cost}</TableCell>
                      <TableCell>{result.creativity}</TableCell>
                      <TableCell>{result.accuracy}</TableCell>
                      <TableCell>{result.overall}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 评测结果图表 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-4">{t.results.timeChart}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={evaluationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="model" tickFormatter={getModelName} />
                      <YAxis />
                      <Tooltip labelFormatter={getModelName} />
                      <Bar dataKey="time" name={t.results.time} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-4">{t.results.scoreChart}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={evaluationData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="model" tickFormatter={getModelName} />
                      <PolarRadiusAxis domain={[8, 10]} />
                      <Radar name={t.results.creativity} dataKey="creativity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name={t.results.accuracy} dataKey="accuracy" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name={t.results.overall} dataKey="overall" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip labelFormatter={getModelName} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
