import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import IconButton from '@mui/material/IconButton'
import { COLORS } from '../../../styles/theme/colors'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { trimLongString } from '../../utils/trimLongString'

const clipboardTooltipDuration = 2000

type CopyToClipboardButtonProps = {
  value: string
}

const copyToClipboard = (value: string) => void window.navigator.clipboard.writeText(value)

export const CopyToClipboardButton: FC<CopyToClipboardButtonProps> = ({ value }) => {
  const { t } = useTranslation()
  let timeout = useRef<number | undefined>(undefined)
  const ariaLabel = t('clipboard.label')
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyToClipboard = useCallback(() => {
    if (isCopied) {
      return
    }
    copyToClipboard(value)
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
    <Tooltip arrow onOpen={hideTooltip} open={isCopied} placement="top" title={t('clipboard.success')}>
      <IconButton color="inherit" aria-label={ariaLabel} onClick={handleCopyToClipboard}>
        <ContentCopyIcon fontSize="small" sx={{ color: COLORS.brandDark }} />
      </IconButton>
    </Tooltip>
  )
}

type CopyToClipboardProps = CopyToClipboardButtonProps & {
  label?: string
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ label, value }) => {
  let timeout = useRef<number | undefined>(undefined)
  const [isCopied, setIsCopied] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCopyToClipboard = useCallback(() => {
    if (isCopied) {
      return
    }
    copyToClipboard(value)
    setIsCopied(true)
  }, [value])

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
      {label || (isMobile ? trimLongString(value) : value)}
      <CopyToClipboardButton value={value} />
    </Box>
  )
}
