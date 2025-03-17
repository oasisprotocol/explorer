import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import InfoIcon from '@mui/icons-material/Info'
import ErrorIcon from '@mui/icons-material/Error'

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info'

const variantStyles: Record<StatusVariant, { bgColor: string; fgColor: string }> = {
  success: {
    bgColor: COLORS.honeydew,
    fgColor: COLORS.brandExtraDark,
  },
  warning: {
    bgColor: COLORS.warningBackground,
    fgColor: COLORS.brandExtraDark,
  },
  danger: {
    bgColor: COLORS.linen,
    fgColor: COLORS.brandExtraDark,
  },
  info: {
    bgColor: COLORS.brandLightBlue,
    fgColor: COLORS.brandExtraDark,
  },
}

const variantIcon: Record<StatusVariant, ReactNode> = {
  success: <CheckCircleIcon color="success" fontSize="small" />,
  warning: <ErrorIcon color="warning" fontSize="small" />,
  danger: <CancelIcon color="error" fontSize="small" />,
  info: <InfoIcon color="info" fontSize="small" />,
}

export type StatusBadgeProps = {
  label: string
  icon?: ReactNode
  variant?: StatusVariant
  bgColor?: string
  fgColor?: string
}

const StyledBadge = styled(Box, {
  shouldForwardProp: prop => !['bgColor', 'fgColor'].includes(prop as string),
})<{ bgColor: string; fgColor: string }>(({ bgColor, fgColor }) => {
  return {
    display: 'inline-flex',
    gap: 8,
    flexShrink: 0,
    justifyContent: 'center',
    height: 28,
    fontSize: '12px',
    backgroundColor: bgColor,
    color: fgColor,
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
  }
})

export const StatusBadge = ({ label, icon, variant = 'info' }: StatusBadgeProps) => {
  return (
    <StyledBadge bgColor={variantStyles[variant].bgColor} fgColor={variantStyles[variant].fgColor}>
      {label}
      {icon || variantIcon[variant]}
    </StyledBadge>
  )
}
