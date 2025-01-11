import { useState } from "react"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

interface TagSelectProps {
  className?: string
  placeholder?: string
  options: string[]
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagSelect({
  className,
  placeholder,
  options,
  value,
  onChange
}: TagSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const toggleTag = (tag: string) => {
    const newTags = value.includes(tag)
      ? value.filter(t => t !== tag)
      : [...value, tag]
    onChange(newTags)
  }

  const clearTags = () => {
    onChange([])
    setOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder || t('Prompts.filterByTags')}</span>
            ) : (
              <div className="flex gap-1 flex-wrap">
                {value.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="mr-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t('Prompts.searchTags')} />
            <CommandList>
              <CommandEmpty>{t('Prompts.noTags')}</CommandEmpty>
              <CommandGroup>
                {options.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => toggleTag(tag)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(tag) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {value.length > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                onClick={clearTags}
                className="w-full justify-start text-sm"
              >
                <X className="mr-2 h-4 w-4" />
                {t('Prompts.clearTags')}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
