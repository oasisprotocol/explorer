import { FC, PropsWithChildren } from 'react'
import { MobileBackdrop, MobileGraphTooltip } from './index'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '../../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'

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
