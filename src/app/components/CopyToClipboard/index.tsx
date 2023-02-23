import { FC, useCallback, useEffect, useRef, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { COLORS } from '../../../styles/theme/colors'
import ButtonUnstyled from '@mui/base/ButtonUnstyled'
import { styled } from '@mui/material/styles'

const clipboardTooltipDuration = 2000

type CopyToClipboardProps = {
  label?: ReactNode
  value: string
}

const StyledButton = styled(ButtonUnstyled)(() => ({
  border: 0,
  background: 'none',
  cursor: 'pointer',
}))

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ label, value }) => {
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
      <StyledButton
        color="inherit"
        onClick={handleCopyToClipboard}
        aria-label={ariaLabel}
        sx={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {label || value}
        <ContentCopyIcon fontSize="small" sx={{ color: COLORS.brandDark, ml: 4 }} />
      </StyledButton>
    </Tooltip>
  )
}
