import { FC, PropsWithChildren } from 'react'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '../../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const MobileBackdrop = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: COLORS.black,
  opacity: 0.3,
  zIndex: 4,
}))

export const MobileGraphTooltip = styled(Box)(() => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 120,
  zIndex: 4,
  '> svg': {
    position: 'fixed',
    right: 10,
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
      <MobileBackdrop />
      <Fade in>
        <MobileGraphTooltip>
          <CloseIcon
            onClick={onClose}
            fontSize="medium"
            sx={{ color: COLORS.white }}
            aria-label={t('home.tooltip.close')}
          />
          {children}
        </MobileGraphTooltip>
      </Fade>
    </>
  )
}
