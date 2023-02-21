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
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { COLORS } from '../../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export const SapphireTooltip: FC<GraphTooltipExtendedProps> = ({ children, offsetWidth, offsetHeight }) => {
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
            <AccessTimeIcon
              fontSize="xlarge"
              sx={{ color: COLORS.aqua }}
              aria-label={t('home.tooltip.comingSoonAria')}
            />
          </GraphTooltipIcon>
          <GraphTooltipText disabled>
            <GraphTooltipHeaderText>
              <Typography variant="body2" color={COLORS.white}>
                Sapphire
              </Typography>
              <Typography component="span" sx={{ fontSize: '12px', opacity: 0.5 }} color={COLORS.white}>
                {t('home.tooltip.coming')}
              </Typography>
            </GraphTooltipHeaderText>
            <GraphTooltipDescriptionText>
              <Typography variant="caption" color={COLORS.white}>
                {t('home.tooltip.sapphireParaTimeAvailableSoon')}
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
