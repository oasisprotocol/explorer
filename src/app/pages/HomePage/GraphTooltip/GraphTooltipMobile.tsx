import { FC, PropsWithChildren } from 'react'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '../../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

export const MobileBackdrop = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: COLORS.black,
  opacity: 0.3,
  zIndex: 4,
}))

export const MobileGraphTooltip = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 120,
  zIndex: 4,
  '> button': {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: 125,
  },
}))

export interface GraphTooltipMobileProps {
  onClose: () => void
}

export const GraphTooltipMobile: FC<PropsWithChildren<GraphTooltipMobileProps>> = ({ children, onClose }) => {
  const { t } = useTranslation()

  return (
    <>
      <MobileBackdrop onClick={onClose} />
      <Fade in>
        <MobileGraphTooltip>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon fontSize="medium" sx={{ color: COLORS.white }} aria-label={t('home.tooltip.close')} />
          </IconButton>
          {children}
        </MobileGraphTooltip>
      </Fade>
    </>
  )
}
