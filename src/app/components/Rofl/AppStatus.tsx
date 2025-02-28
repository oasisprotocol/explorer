import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { COLORS } from '../../../styles/theme/colors'

type RoflAppStatusTypes = 'active' | 'inactive'

const statusBgColor: Record<RoflAppStatusTypes, string> = {
  active: COLORS.honeydew,
  inactive: COLORS.linen,
}

export const statusIcon: Record<RoflAppStatusTypes, ReactNode> = {
  active: <CheckCircleIcon color="success" fontSize="small" />,
  inactive: <CancelIcon color="error" fontSize="small" />,
}

const StyledBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'status',
})(({ status }: { status: RoflAppStatusTypes }) => {
  return {
    display: 'inline-flex',
    gap: 8,
    flexShrink: 0,
    justifyContent: 'center',
    height: 28,
    fontSize: '12px',
    backgroundColor: statusBgColor[status],
    color: COLORS.brandExtraDark,
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
  }
})

type AppStatusProps = {
  status: RoflAppStatusTypes
}

export const AppStatus: FC<AppStatusProps> = ({ status }) => {
  const { t } = useTranslation()
  const statusLabel: Record<RoflAppStatusTypes, string> = {
    active: t('rofl.active'),
    inactive: t('rofl.inactive'),
  }

  return (
    <StyledBadge status={status}>
      {statusLabel[status]}
      {statusIcon[status]}
    </StyledBadge>
  )
}
