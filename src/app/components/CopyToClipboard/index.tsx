import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { COLORS } from '../../../styles/theme/colors'
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
    <Tooltip arrow onOpen={hideTooltip} open={isCopied} placement="right" title={t('clipboard.success')}>
      <button
        onClick={handleCopyToClipboard}
        aria-label={ariaLabel}
        className={cn('inline-flex items-center ml-3', className)}
      >
        <ContentCopyIcon sx={{ fontSize: '14px', color: COLORS.brandDark }} />
      </button>
    </Tooltip>
  )
}
