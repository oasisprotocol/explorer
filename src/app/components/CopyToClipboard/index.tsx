import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { COLORS } from '../../../styles/theme/colors'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const clipboardTooltipDuration = 2000

type CopyToClipboardProps = {
  floating?: boolean
  isFloatingVisible?: boolean
  value: string
  label?: string
}

const StyledIconButton = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'floating' && prop !== 'isFloatingVisible',
})<{ floating?: boolean; isFloatingVisible?: boolean }>(({ theme, floating, isFloatingVisible }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: 0,
  background: 'none',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: 0,
  marginLeft: theme.spacing(4),
  ...(floating && {
    position: 'absolute',
    right: theme.spacing(5),
    top: theme.spacing(4),
    opacity: isFloatingVisible ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
    zIndex: theme.zIndex.fab,
    boxShadow: theme.shadows[1],
    background: COLORS.white,
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 0,
  }),
}))

type FloatingCopyToClipboardProps = {
  isVisible: boolean
  value: string
}

export const FloatingCopyToClipboard: FC<FloatingCopyToClipboardProps> = ({ isVisible, value }) => {
  return <CopyToClipboard floating isFloatingVisible={isVisible} value={value} />
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ label, floating, isFloatingVisible, value }) => {
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
      {label ? (
        <Button variant="outlined" color="secondary" onClick={handleCopyToClipboard} aria-label={ariaLabel}>
          {label}
        </Button>
      ) : (
        <StyledIconButton
          floating={floating}
          isFloatingVisible={isFloatingVisible}
          color="inherit"
          onClick={handleCopyToClipboard}
          aria-label={ariaLabel}
        >
          <ContentCopyIcon sx={{ fontSize: '1.25em', color: COLORS.brandDark }} />
        </StyledIconButton>
      )}
    </Tooltip>
  )
}
