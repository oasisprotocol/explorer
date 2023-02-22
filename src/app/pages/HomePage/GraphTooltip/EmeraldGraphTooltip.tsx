import {
  GraphTooltip,
  GraphTooltipDescriptionText,
  GraphTooltipExtendedProps,
  GraphTooltipHeaderText,
  GraphTooltipIcon,
  GraphTooltipStyled,
  GraphTooltipText,
} from './index'
import { FC, MouseEventHandler } from 'react'
import { COLORS } from '../../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import AdjustIcon from '@mui/icons-material/Adjust'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { GraphTooltipMobile, GraphTooltipMobileProps } from './GraphTooltipMobile'
import { useNavigate } from 'react-router-dom'
import { RouteUtils } from '../../../utils/route-utils'
import { ParaTime } from '../../../../config'

interface EmeraldGraphTooltipContentProps {
  onClick?: MouseEventHandler<HTMLDivElement>
}

const EmeraldGraphTooltipContent: FC<EmeraldGraphTooltipContentProps> = ({ onClick }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <GraphTooltipStyled isMobile={isMobile} onClick={onClick}>
      <GraphTooltipIcon isMobile={isMobile}>
        <AdjustIcon fontSize="xxlarge" sx={{ color: COLORS.aqua }} />
        <Typography
          component="span"
          color={COLORS.white}
          sx={{ fontSize: '10px', position: 'absolute', bottom: '10px' }}
        >
          {t('home.tooltip.discoverMore')}
        </Typography>
      </GraphTooltipIcon>
      <GraphTooltipText isMobile={isMobile}>
        <GraphTooltipHeaderText>
          <Typography variant="body2" color={COLORS.white}>
            Emerald
          </Typography>
          <Typography component="span" sx={{ display: 'flex', fontSize: '12px' }} color={COLORS.white}>
            {t('home.tooltip.paraTimeOnline')}
            <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
          </Typography>
        </GraphTooltipHeaderText>
        <GraphTooltipDescriptionText>
          <Typography variant="caption" color={COLORS.white}>
            {t('home.tooltip.emeraldParaTimeDesc')}
          </Typography>
        </GraphTooltipDescriptionText>
      </GraphTooltipText>
    </GraphTooltipStyled>
  )
}

export const EmeraldGraphTooltip: FC<GraphTooltipExtendedProps> = ({
  children,
  offsetWidth,
  offsetHeight,
  open,
  onOpen,
  onClose,
  onClick,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (isMobile) {
    return children
  }

  return (
    <GraphTooltip
      offsetWidth={offsetWidth}
      offsetHeight={offsetHeight}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      title={<EmeraldGraphTooltipContent onClick={onClick} />}
    >
      {children}
    </GraphTooltip>
  )
}

export const EmeraldGraphMobileTooltip: FC<GraphTooltipMobileProps> = props => {
  const navigate = useNavigate()

  const navigateTo = () => {
    navigate(RouteUtils.getDashboardRoute(ParaTime.Emerald))
  }

  return (
    <GraphTooltipMobile {...props}>
      <EmeraldGraphTooltipContent onClick={navigateTo} />
    </GraphTooltipMobile>
  )
}
