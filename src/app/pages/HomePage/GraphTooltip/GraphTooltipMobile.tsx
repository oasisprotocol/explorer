import { FC } from 'react'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import { COLORS } from '../../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { GraphTooltipBody, GraphTooltipHeader, graphTooltipMap, GraphTooltipStyled } from './index'
import useMediaQuery from '@mui/material/useMediaQuery'
import { GraphEndpoint } from '../ParaTimeSelector/Graph/types'
import { useNavigate } from 'react-router-dom'
import { RouteUtils } from '../../../utils/route-utils'
import { ParaTime } from '../../../../config'
import * as React from 'react'
import { zIndexHomePage } from '../index'

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
  graphEndpoint: GraphEndpoint
  onClose: () => void
}

export const GraphTooltipMobile: FC<GraphTooltipMobileProps> = ({ graphEndpoint, onClose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { header, body, disabled, enableNavigation } = graphTooltipMap[graphEndpoint]

  const navigateTo = () => {
    if (!enableNavigation) {
      return
    }

    navigate(RouteUtils.getDashboardRoute(graphEndpoint as ParaTime))
  }

  return (
    <>
      <MobileBackdrop onClick={onClose} />
      <Fade in>
        <MobileGraphTooltip onClick={navigateTo}>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon fontSize="medium" sx={{ color: COLORS.white }} aria-label={t('home.tooltip.close')} />
          </IconButton>
          <GraphTooltipStyled disabled={disabled} isMobile={isMobile}>
            <GraphTooltipHeader {...header} comingSoon={!disabled} />
            <GraphTooltipBody {...body} disabled={disabled} />
          </GraphTooltipStyled>
        </MobileGraphTooltip>
      </Fade>
    </>
  )
}
