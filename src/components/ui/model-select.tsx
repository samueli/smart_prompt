import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ModelOption {
  value: string
  label: string
  category: string
}

interface ModelSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  models: Record<string, string>
  disabled?: boolean
}

export function ModelSelect({
  value,
  onValueChange,
  placeholder = "选择模型...",
  models,
  disabled = false
}: ModelSelectProps) {
  const [open, setOpen] = React.useState(false)

  // 将模型按类别分组
  const modelOptions: ModelOption[] = Object.entries(models).map(([value, label]) => {
    let category = "其他"
    if (value.includes("gpt")) category = "OpenAI"
    else if (value.includes("claude")) category = "Anthropic"
    else if (value.includes("palm") || value.includes("gemini")) category = "Google"
    else if (value.includes("llama")) category = "Meta"
    else if (value.includes("mistral") || value.includes("mixtral")) category = "Mistral AI"
    else if (value.includes("qwen")) category = "阿里云"
    else if (value.includes("yi")) category = "零一万物"
    else if (value.includes("chatglm")) category = "智谱AI"
    else if (value.includes("baichuan")) category = "百川智能"
    return { value, label, category }
  })

  // 按类别对模型进行分组
  const groupedModels = modelOptions.reduce((acc, model) => {
    if (!acc[model.category]) {
      acc[model.category] = []
    }
    acc[model.category].push(model)
    return acc
  }, {} as Record<string, ModelOption[]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? models[value]
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索模型..." />
          <CommandEmpty>未找到匹配的模型</CommandEmpty>
          {Object.entries(groupedModels).map(([category, models]) => (
            <CommandGroup key={category} heading={category}>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
