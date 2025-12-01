import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Copy } from 'lucide-react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

const clipboardTooltipDuration = 2000

type CopyToClipboardProps = {
  className?: string
  value: string
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ className, value }) => {
  const { t } = useTranslation()
  const timeout = useRef<number | undefined>(undefined)
  const ariaLabel = t('clipboard.label')
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyToClipboard = useCallback(() => {
    if (isCopied) {
      return
    }
    window.navigator.clipboard.writeText(value)
    setIsCopied(true)
  }, [isCopied, value])
  const hideTooltip = useCallback(
    () => (timeout.current = window.setTimeout(() => setIsCopied(false), clipboardTooltipDuration)),
    [],
  )

  useEffect(() => {
    return () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current)
      }
    }
  }, [])

  return (
    <Tooltip onOpenChange={hideTooltip} open={isCopied} side="right" title={t('clipboard.success')}>
      <button
        onClick={handleCopyToClipboard}
        aria-label={ariaLabel}
        className={cn('inline-flex items-center ml-2', className)}
      >
        <Copy size={14} className="stroke-primary" />
      </button>
    </Tooltip>
  )
}
