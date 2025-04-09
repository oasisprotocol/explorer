import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import InfoIcon from '@mui/icons-material/Info'
import ErrorIcon from '@mui/icons-material/Error'

export type StatusVariant = 'success' | 'partialsuccess' | 'warning' | 'danger' | 'info'

const variantStyles: Record<StatusVariant, { bgColor: string }> = {
  success: {
    bgColor: COLORS.eucalyptus,
  },
  partialsuccess: {
    bgColor: COLORS.honeydew,
  },
  warning: {
    bgColor: COLORS.warningBackground,
  },
  danger: {
    bgColor: COLORS.linen,
  },
  info: {
    bgColor: COLORS.brandLightBlue,
  },
}

const variantIcon: Record<StatusVariant, ReactNode> = {
  success: <CheckCircleIcon sx={{ color: COLORS.honeydew }} fontSize="small" />,
  partialsuccess: <CheckCircleIcon color="success" fontSize="small" />,
  warning: <ErrorIcon color="warning" fontSize="small" />,
  danger: <CancelIcon color="error" fontSize="small" />,
  info: <InfoIcon color="info" fontSize="small" />,
}

type StatusBadgeProps = {
  label: string
  icon?: ReactNode
  variant?: StatusVariant
}

const StyledBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'bgColor',
})<{ bgColor: string }>(({ bgColor }) => {
  return {
    display: 'inline-flex',
    gap: 8,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    fontSize: '12px',
    backgroundColor: bgColor,
    color: COLORS.brandExtraDark,
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
  }
})

export const StatusBadge = ({ label, icon, variant = 'info' }: StatusBadgeProps) => {
  return (
    <StyledBadge bgColor={variantStyles[variant].bgColor}>
      {label}
      {icon || variantIcon[variant]}
    </StyledBadge>
  )
}
