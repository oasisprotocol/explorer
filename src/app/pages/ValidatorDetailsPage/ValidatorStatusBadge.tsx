import { useTranslation } from 'react-i18next'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

type ValidatorStatus = 'active' | 'waiting' | 'inactive'

const statusVariant: Record<ValidatorStatus, 'success' | 'info' | 'error'> = {
  active: 'success',
  waiting: 'info',
  inactive: 'error',
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

  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
}
