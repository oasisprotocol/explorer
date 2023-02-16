import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { FC } from 'react'
import Box from '@mui/material/Box'
import { COLORS } from '../../../../styles/theme/colors'

export const GraphTooltipStyled = styled(Box)(() => ({
  display: 'flex',
  height: '100%',
  border: `1px solid ${COLORS.aqua}`,
  borderRadius: '0 12px 12px 0',
}))

export const GraphTooltipIcon = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 120px',
  height: '100%',
  borderRight: `1px solid ${COLORS.aqua}`,
  backgroundColor: COLORS.brandExtraDark,
}))

interface GraphTooltipTextProps {
  disabled?: boolean
}

export const GraphTooltipText = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['disabled'] as (keyof GraphTooltipTextProps)[]).includes(prop as keyof GraphTooltipTextProps),
})<GraphTooltipTextProps>(({ theme, disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: '0 1 100%',
  padding: theme.spacing(4),
  backgroundColor: disabled ? COLORS.shadowBlue : COLORS.brandExtraDark,
  borderRadius: '0 12px 12px 0',
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

export interface GraphTooltipExtendedProps {
  children: TooltipProps['children']
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
)(({ theme, offsetHeight, offsetWidth }) => ({
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

interface GraphTooltipProps {
  title: TooltipProps['title']
  children: TooltipProps['children']
  offsetWidth?: number
  offsetHeight?: number
}

export const GraphTooltip: FC<GraphTooltipProps> = ({ title, children, offsetWidth, offsetHeight }) => {
  return (
    <GraphTooltipWrapper
      placement="right-start"
      offsetWidth={offsetWidth}
      offsetHeight={offsetHeight}
      title={title}
    >
      {children}
    </GraphTooltipWrapper>
  )
}
