import { useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Download, Copy, X } from 'lucide-react'

interface SharePosterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
}

export function SharePosterDialog({
  open,
  onOpenChange,
  title,
  content,
}: SharePosterDialogProps) {
  const { t } = useTranslation()
  const posterRef = useRef<HTMLDivElement>(null)

  const truncateContent = (text: string) => {
    const maxLength = 300
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const handleCopy = async () => {
    if (!posterRef.current) return

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      })
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error(t('Prompts.copyFailed'), { duration: 3000 })
          return
        }
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          toast.success(t('Prompts.copySuccess'), { duration: 3000 })
        } catch (error) {
          console.error('Error copying image:', error)
          toast.error(t('Prompts.copyFailed'), { duration: 3000 })
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error(t('Prompts.copyFailed'), { duration: 3000 })
    }
  }

  const handleDownload = async () => {
    if (!posterRef.current) return

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      })
      
      const link = document.createElement('a')
      link.download = `${title}-smart-prompt.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error(t('Prompts.downloadFailed'), { duration: 3000 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('Prompts.share')}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Poster Preview */}
          <div className="flex justify-center">
            <div 
              ref={posterRef}
              className="aspect-[3/4] bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 p-8 rounded-lg shadow-lg relative dark:from-yellow-100 dark:via-blue-100 dark:to-purple-100"
              style={{ width: '450px', height: '600px' }}
            >
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

              {/* Content */}
              <div className="flex-1 mb-8 overflow-y-auto" style={{ maxHeight: 'calc(100% - 200px)' }}>
                <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                  <p className="text-base text-gray-900 whitespace-pre-wrap break-words">
                    {truncateContent(content)}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />
                <div className="flex justify-between">
                  {/* Left Side: Logo, Name and Text */}
                  <div className="flex flex-col justify-between h-20">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://pic1.imgdb.cn/item/6774c519d0e0a243d4ed4c17.png" 
                          alt="Smart Prompt Logo" 
                          className="h-6 w-6"
                        />
                        <span className="font-bold text-base text-gray-900">
                          Smart Prompt
                        </span>
                      </div>
                      <a 
                        href="https://prompt.playwithai.fun" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-gray-500 mt-1 hover:text-gray-700"
                      >
                        https://prompt.playwithai.fun
                      </a>
                    </div>
                    <span className="text-xs text-gray-500">
                      {t('Prompts.scanForMore')}
                    </span>
                  </div>

                  {/* Right Side: QR Code */}
                  <div className="w-20 h-20 bg-white rounded-lg p-2">
                    <QRCodeSVG
                      value="https://prompt.playwithai.fun"
                      size={64}
                      level="L"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              {t('Prompts.cancel')}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('Prompts.copyPoster')}
            </Button>
            <Button
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('Prompts.download')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
