import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Pending from '@mui/icons-material/Pending'
import { StatusBadge, StatusVariant } from '../../components/common/StatusBadge'

type ValidatorStatus = 'active' | 'waiting' | 'inactive'

const statusVariant: Record<ValidatorStatus, StatusVariant> = {
  active: 'success',
  waiting: 'info',
  inactive: 'danger',
}

export const statusIcon: Partial<Record<ValidatorStatus, ReactNode>> = {
  waiting: <Pending color="info" fontSize="small" />,
}

type ValidatorStatusBadgeProps = {
  active: boolean
  inValidatorSet: boolean
}

const getValidatorBadgeStatus = ({ active, inValidatorSet }: ValidatorStatusBadgeProps) => {
  if (inValidatorSet) return 'active'
  return active ? 'waiting' : 'inactive'
}

export const ValidatorStatusBadge = ({ active, inValidatorSet }: ValidatorStatusBadgeProps) => {
  const { t } = useTranslation()
  const status = getValidatorBadgeStatus({ active, inValidatorSet }) as ValidatorStatus
  const statusLabel: Record<ValidatorStatus, string> = {
    active: t('validator.active'),
    waiting: t('validator.waiting'),
    inactive: t('validator.inactive'),
  }

  return <StatusBadge label={statusLabel[status]} icon={statusIcon[status]} variant={statusVariant[status]} />
}
