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

export const EmeraldTooltip: FC<GraphTooltipExtendedProps> = ({
  children,
  offsetWidth,
  offsetHeight,
  open,
  onOpen,
  onClose,
  onClick,
}) => {
  const { t } = useTranslation()

  return (
    <GraphTooltip
      offsetWidth={offsetWidth}
      offsetHeight={offsetHeight}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      title={
        <GraphTooltipStyled onClick={onClick}>
          <GraphTooltipIcon>
            <AdjustIcon fontSize="xxlarge" sx={{ color: COLORS.aqua }} />
            <Typography
              component="span"
              color={COLORS.white}
              sx={{ fontSize: '10px', position: 'absolute', bottom: '10px' }}
            >
              {t('home.tooltip.discoverMore')}
            </Typography>
          </GraphTooltipIcon>
          <GraphTooltipText>
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
      }
    >
      {children}
    </GraphTooltip>
  )
}
