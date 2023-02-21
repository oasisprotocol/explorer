import {
  GraphTooltip,
  GraphTooltipDescriptionText,
  GraphTooltipExtendedProps,
  GraphTooltipHeaderText,
  GraphTooltipIcon,
  GraphTooltipStyled,
  GraphTooltipText,
} from './index'
import { FC } from 'react'
import { COLORS } from '../../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import AdjustIcon from '@mui/icons-material/Adjust'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export const ConsensusTooltip: FC<GraphTooltipExtendedProps> = ({ children, offsetWidth, offsetHeight }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (isMobile) {
    return children
  }

  return (
    <GraphTooltip
      offsetWidth={offsetWidth}
      offsetHeight={offsetHeight}
      title={
        <GraphTooltipStyled>
          <GraphTooltipIcon>
            <AdjustIcon fontSize="xxlarge" sx={{ color: COLORS.aqua }} />
          </GraphTooltipIcon>
          <GraphTooltipText>
            <GraphTooltipHeaderText>
              <Typography variant="body2" color={COLORS.white}>
                Consensus
              </Typography>
              <Typography component="span" sx={{ display: 'flex', fontSize: '12px' }} color={COLORS.white}>
                {t('home.tooltip.online')}
                <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
              </Typography>
            </GraphTooltipHeaderText>
            <GraphTooltipDescriptionText>
              <Typography variant="caption" color={COLORS.white}>
                {t('home.tooltip.consensusParaTimeDesc')}
              </Typography>
            </GraphTooltipDescriptionText>
          </GraphTooltipText>
        </GraphTooltipStyled>
      }
    >
      {children}
    </GraphTooltip>
  )
}
