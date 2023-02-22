import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { FC } from 'react'
import Box from '@mui/material/Box'
import { COLORS } from '../../../../styles/theme/colors'

export interface GraphTooltipStyledProps {
  isMobile: boolean
  disabled?: boolean
}

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
  backgroundColor: COLORS.brandExtraDark,
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
  backgroundColor: disabled ? COLORS.shadowBlue : COLORS.brandExtraDark,
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

export interface GraphTooltipExtendedProps extends Omit<TooltipProps, 'title'> {
  offsetWidth?: number
  offsetHeight?: number
}

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

interface GraphTooltipProps extends TooltipProps {
  offsetWidth?: number
  offsetHeight?: number
}

export const GraphTooltip: FC<GraphTooltipProps> = ({ children, ...restProps }) => {
  return (
    <GraphTooltipWrapper {...restProps} placement="right-start">
      {children}
    </GraphTooltipWrapper>
  )
}
