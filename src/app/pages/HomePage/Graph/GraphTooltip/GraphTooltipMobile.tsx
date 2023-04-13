import { FC, MouseEvent } from 'react'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '../../../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { GraphTooltipBody, GraphTooltipHeader, layerTooltipMap, GraphTooltipStyled } from './index'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { RouteUtils } from '../../../../utils/route-utils'
import { zIndexHomePage } from '../../index'
import { Layer } from '../../../../../oasis-indexer/api'

export const MobileBackdrop = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: COLORS.black,
  opacity: 0.3,
  zIndex: zIndexHomePage.mobileTooltip,
}))

export const MobileGraphTooltip = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 120,
  zIndex: zIndexHomePage.mobileTooltip,
  '> button': {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: 125,
  },
}))

export interface GraphTooltipMobileProps {
  layer: Layer
  onClose: (e?: MouseEvent) => void
}

export const GraphTooltipMobile: FC<GraphTooltipMobileProps> = ({ layer, onClose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { body, disabled, enableNavigation } = layerTooltipMap[layer]

  const navigateTo = () => {
    if (!enableNavigation) {
      return
    }

    navigate(RouteUtils.getDashboardRoute(layer))
  }

  return (
    <>
      <MobileBackdrop onClick={onClose} />
      <Fade in>
        <MobileGraphTooltip>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon fontSize="medium" sx={{ color: COLORS.white }} aria-label={t('home.tooltip.close')} />
          </IconButton>
          <GraphTooltipStyled disabled={disabled} isMobile={isMobile} onClick={navigateTo}>
            <GraphTooltipHeader disabled={disabled} />
            <GraphTooltipBody {...body} disabled={disabled} />
          </GraphTooltipStyled>
        </MobileGraphTooltip>
      </Fade>
    </>
  )
}
