import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { COLORS } from '../../../styles/theme/colors'

type AppStatus = 'active' | 'inactive'

const statusBgColor: Record<AppStatus, string> = {
  active: COLORS.honeydew,
  inactive: COLORS.linen,
}

const statusFgColor: Record<AppStatus, string> = {
  active: COLORS.brandExtraDark,
  inactive: COLORS.brandExtraDark,
}

export const statusIcon: Record<AppStatus, ReactNode> = {
  active: <CheckCircleIcon color="success" fontSize="small" />,
  inactive: <CancelIcon color="error" fontSize="small" />,
}

const StyledBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'status',
})(({ status }: { status: AppStatus }) => {
  return {
    display: 'inline-flex',
    gap: 8,
    flexShrink: 0,
    justifyContent: 'center',
    height: 28,
    fontSize: '12px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
  }
})

type AppStatusProps = {
  active: boolean
}

export const StatusBadge: FC<AppStatusProps> = ({ active }) => {
  const { t } = useTranslation()
  const status = active ? 'active' : 'inactive'
  const statusLabel: Record<AppStatus, string> = {
    active: t('validator.active'),
    inactive: t('validator.inactive'),
  }

  return (
    <StyledBadge status={status}>
      {statusLabel[status]}
      {statusIcon[status]}
    </StyledBadge>
  )
}
