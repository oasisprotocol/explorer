import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import Pending from '@mui/icons-material/Pending'
import { COLORS } from '../../../styles/theme/colors'

type ValidatorStatus = 'active' | 'waiting' | 'inactive'

const statusBgColor: Record<ValidatorStatus, string> = {
  active: COLORS.honeydew,
  waiting: COLORS.brandLightBlue,
  inactive: COLORS.linen,
}

const statusFgColor: Record<ValidatorStatus, string> = {
  active: COLORS.brandExtraDark,
  waiting: COLORS.brandExtraDark,
  inactive: COLORS.brandExtraDark,
}

export const statusIcon: Record<ValidatorStatus, ReactNode> = {
  active: <CheckCircleIcon color="success" fontSize="small" />,
  waiting: <Pending color="info" fontSize="small" />,
  inactive: <CancelIcon color="error" fontSize="small" />,
}

const StyledBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'status',
})(({ status }: { status: ValidatorStatus }) => {
  return {
    display: 'flex',
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

type ValidatorStatusBadgeProps = {
  active: boolean
  inValidatorSet: boolean
}

const getValidatorBadgeStatus = ({ active, inValidatorSet }: ValidatorStatusBadgeProps) => {
  if (inValidatorSet) return 'active'
  return active ? 'waiting' : 'inactive'
}

export const ValidatorStatusBadge: FC<ValidatorStatusBadgeProps> = ({ active, inValidatorSet }) => {
  const { t } = useTranslation()
  const status = getValidatorBadgeStatus({ active, inValidatorSet })
  const statusLabel: Record<ValidatorStatus, string> = {
    active: t('validator.active'),
    waiting: t('validator.waiting'),
    inactive: t('validator.inactive'),
  }

  return (
    <StyledBadge status={status}>
      {statusLabel[status]}
      {statusIcon[status]}
    </StyledBadge>
  )
}
