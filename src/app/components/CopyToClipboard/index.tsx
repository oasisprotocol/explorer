import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import IconButton from '@mui/material/IconButton'
import { COLORS } from '../../../styles/theme/colors'

const clipboardTooltipDuration = 2000

type CopyToClipboardProps = {
  label?: string
  value: string
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ label, value }) => {
  const { t } = useTranslation()
  let timeout = useRef<number | undefined>(undefined)
  const ariaLabel = t('clipboard.label')
  const [isCopied, setIsCopied] = useState(false)
  const handleCopyToClipboard = useCallback(() => {
    if (isCopied) {
      return
    }
    window.navigator.clipboard.writeText(value)
    setIsCopied(true)
  }, [value])
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
    <Box
      component="span"
      onClick={handleCopyToClipboard}
      sx={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {label || value}
      <Tooltip arrow onOpen={hideTooltip} open={isCopied} placement="top" title={t('clipboard.success')}>
        <IconButton color="inherit" aria-label={ariaLabel}>
          <ContentCopyIcon fontSize="small" sx={{ color: COLORS.brandDark }} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
