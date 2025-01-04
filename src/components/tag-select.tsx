import { useState, useEffect } from "react"
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
import { useLocale } from "@/contexts/LocaleContext"

interface TagSelectProps {
  availableTags: string[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export function TagSelect({
  availableTags,
  selectedTags,
  onChange
}: TagSelectProps) {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)
  const t = messages?.Prompts

  if (!t) return null

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    onChange(newTags)
  }

  const clearTags = () => {
    onChange([])
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto min-h-[2.5rem] py-2"
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTag(tag)
                    }}
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTag(tag)
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              t.selectTags
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t.searchTags} />
            <CommandList>
              <CommandEmpty>{t.noTags}</CommandEmpty>
              <CommandGroup>
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={(currentValue) => {
                        toggleTag(tag)
                      }}
                      className="cursor-pointer"
                    >
                      <div 
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="w-4">
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        {tag}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedTags.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={clearTags}
              >
                {t.clearTags}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
