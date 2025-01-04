import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Info } from "lucide-react"
import { frameworkDescriptions } from "@/config/framework-descriptions"

interface FrameworkInfoPopoverProps {
  framework: string;
  className?: string;
}

export function FrameworkInfoPopover({ framework, className }: FrameworkInfoPopoverProps) {
  const description = frameworkDescriptions[framework]

  if (!description) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          type="button"
          className="inline-flex items-center justify-center rounded-full w-5 h-5 hover:bg-gray-100 focus:outline-none"
        >
          <Info className={`h-4 w-4 text-gray-500 hover:text-gray-700 ${className}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[360px] p-4" 
        align="start"
        side="right"
        sideOffset={10}
      >
        <div className="space-y-2">
          <h4 className="font-medium text-base">{framework}</h4>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
