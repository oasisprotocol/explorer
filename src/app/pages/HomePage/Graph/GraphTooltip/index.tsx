import { styled, useTheme } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { FC } from 'react'
import Box from '@mui/material/Box'
import { COLORS } from '../../../../../styles/theme/colors'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Typography from '@mui/material/Typography'
import AdjustIcon from '@mui/icons-material/Adjust'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import * as React from 'react'
import { RouteUtils } from '../../../../utils/route-utils'
import { useNavigate } from 'react-router-dom'
import { Layer } from '../../../../../config'

export interface GraphTooltipStyledProps {
  isMobile: boolean
  disabled?: boolean
}

export const GraphTooltipStyled = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['isMobile', 'disabled'] as (keyof GraphTooltipStyledProps)[]).includes(
      prop as keyof GraphTooltipStyledProps,
    ),
})<GraphTooltipStyledProps>(({ isMobile, disabled }) => ({
  display: 'flex',
  height: '100%',
  border: `2px solid ${COLORS.aqua}`,
  borderRadius: isMobile ? '12px 12px 0 0' : '0 12px 12px 0',
  cursor: disabled ? 'default' : 'pointer',
}))

export interface GraphTooltipIconProps {
  isMobile: boolean
}

export const GraphTooltipIcon = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['isMobile'] as (keyof GraphTooltipIconProps)[]).includes(prop as keyof GraphTooltipIconProps),
})<GraphTooltipIconProps>(({ isMobile }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 120px',
  height: '100%',
  borderRight: `2px solid ${COLORS.aqua}`,
  backgroundColor: COLORS.brandExtraDark + (isMobile ? '80' : ''),
  borderRadius: isMobile ? '12px 0 0 12px' : '0 0 0 0',
}))

interface GraphTooltipTextProps {
  disabled?: boolean
  isMobile: boolean
}

export const GraphTooltipText = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['disabled', 'isMobile'] as (keyof GraphTooltipTextProps)[]).includes(
      prop as keyof GraphTooltipTextProps,
    ),
})<GraphTooltipTextProps>(({ theme, disabled, isMobile }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: '0 1 100%',
  padding: theme.spacing(4),
  backgroundColor: (disabled ? COLORS.shadowBlue : COLORS.brandExtraDark) + (isMobile ? '80' : ''),
  borderRadius: isMobile ? '0 12px 0 0' : '0 12px 12px 0',
}))

export const GraphTooltipHeaderText = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: '0 0',
}))

export const GraphTooltipDescriptionText = styled(Box)(() => ({
  flex: '0 1 100%',
  display: 'flex',
  alignItems: 'center',
}))

interface GraphTooltipWrapperProps extends TooltipProps {
  offsetWidth?: number
  offsetHeight?: number
}

const GraphTooltipWrapper = styled(
  ({ className, children, offsetWidth: _, offsetHeight: __, ...props }: GraphTooltipWrapperProps) => (
    <Tooltip {...props} classes={{ popper: className }}>
      {children}
    </Tooltip>
  ),
)(({ offsetHeight, offsetWidth }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    position: 'absolute',
    width: 375,
    height: 120,
    borderRadius: 0,
    transform:
      offsetWidth &&
      offsetHeight &&
      `translate(${((offsetWidth + (120 - offsetWidth) / 2) * -1) /* center icon adjustment */
        .toFixed()}px, ${(((120 - offsetHeight) / 2) * -1).toFixed()}px) !important`,
    padding: 0,
    margin: '0 !important',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}))

export const layerTooltipMap: {
  [key in Layer]: {
    disabled: boolean
    enableNavigation?: boolean
    header: GraphTooltipHeaderProps
    body: GraphTooltipBodyProps
  }
} = {
  [Layer.Sapphire]: {
    disabled: true,
    header: {},
    body: {
      title: (t: TFunction) => t('common.sapphire'),
      caption: (t: TFunction) => t('home.tooltip.coming'),
      body: (t: TFunction) => t('home.tooltip.sapphireParaTimeAvailableSoon'),
    },
  },
  [Layer.Emerald]: {
    disabled: false,
    enableNavigation: true,
    header: {
      discoverMore: true,
    },
    body: {
      title: (t: TFunction) => t('common.emerald'),
      caption: (t: TFunction) => t('common.paraTimeOnline'),
      body: (t: TFunction) => t('home.tooltip.emeraldParaTimeDesc'),
    },
  },
  [Layer.Cipher]: {
    disabled: true,
    header: {},
    body: {
      title: (t: TFunction) => t('common.cipher'),
      caption: (t: TFunction) => t('home.tooltip.coming'),
      body: (t: TFunction) => t('home.tooltip.cipherParaTimeAvailableSoon'),
    },
  },
  [Layer.Consensus]: {
    disabled: false,
    header: {},
    body: {
      title: (t: TFunction) => t('common.consensus'),
      caption: (t: TFunction) => t('home.tooltip.online'),
      body: (t: TFunction) => t('home.tooltip.consensusParaTimeDesc'),
    },
  },
}

interface GraphTooltipProps extends Omit<TooltipProps, 'title'> {
  offsetWidth?: number
  offsetHeight?: number
  layer: Layer
}

interface GraphTooltipHeaderProps {
  comingSoon?: boolean
  discoverMore?: boolean
}

export const GraphTooltipHeader: FC<GraphTooltipHeaderProps> = ({ comingSoon, discoverMore }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <GraphTooltipIcon isMobile={isMobile}>
      {comingSoon && (
        <AccessTimeIcon
          sx={{ color: COLORS.aqua, fontSize: 33 }}
          aria-label={t('home.tooltip.comingSoonAria')}
        />
      )}
      {!comingSoon && <AdjustIcon sx={{ color: COLORS.aqua, fontSize: 51 }} />}
      {discoverMore && (
        <Typography
          component="span"
          color={COLORS.white}
          sx={{ fontSize: '10px', position: 'absolute', bottom: '10px' }}
        >
          {t('home.tooltip.discoverMore')}
        </Typography>
      )}
    </GraphTooltipIcon>
  )
}

interface GraphTooltipBodyProps {
  title: (t: TFunction) => string
  caption: (t: TFunction) => string
  body: (t: TFunction) => string
  disabled?: boolean
}

export const GraphTooltipBody: FC<GraphTooltipBodyProps> = ({ title, caption, body, disabled }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <GraphTooltipText isMobile={isMobile} disabled={disabled}>
      <GraphTooltipHeaderText>
        <Typography variant="body2" color={COLORS.white}>
          {title(t)}
        </Typography>

        <Typography
          component="span"
          sx={{ display: 'flex', fontSize: '12px', opacity: disabled ? 0.5 : 1 }}
          color={COLORS.white}
        >
          {caption(t)}
          {!disabled && <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />}
        </Typography>
      </GraphTooltipHeaderText>
      <GraphTooltipDescriptionText>
        <Typography variant="caption" color={COLORS.white}>
          {body(t)}
        </Typography>
      </GraphTooltipDescriptionText>
    </GraphTooltipText>
  )
}

export const GraphTooltip: FC<GraphTooltipProps> = ({ children, layer, ...restProps }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { header, body, disabled, enableNavigation } = layerTooltipMap[layer]

  const navigateTo = () => {
    if (!enableNavigation) {
      return
    }

    navigate(RouteUtils.getDashboardRoute(layer))
  }

  return (
    <GraphTooltipWrapper
      {...restProps}
      placement="right-start"
      title={
        <GraphTooltipStyled disabled={disabled} isMobile={isMobile} onClick={navigateTo}>
          <GraphTooltipHeader {...header} comingSoon={!disabled} />
          <GraphTooltipBody {...body} disabled={disabled} />
        </GraphTooltipStyled>
      }
    >
      {children}
    </GraphTooltipWrapper>
  )
}
