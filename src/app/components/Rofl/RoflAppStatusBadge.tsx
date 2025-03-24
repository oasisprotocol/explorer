import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { StatusBadge, StatusVariant } from '../common/StatusBadge'

type RoflAppStatusTypes = 'active' | 'inactive' | 'removed'

function getRoflAppStatus(hasActiveInstances: boolean, removed: boolean): RoflAppStatusTypes {
  if (removed) return 'removed'
  return hasActiveInstances ? 'active' : 'inactive'
}

const statusVariant: Record<RoflAppStatusTypes, StatusVariant> = {
  active: 'success',
  inactive: 'warning',
  removed: 'danger',
}

const statusIcon: Partial<Record<RoflAppStatusTypes, ReactNode>> = {
  inactive: <CheckCircleIcon color="warning" fontSize="small" />,
}

type RoflAppStatusBadgeProps = {
  hasActiveInstances: boolean
  removed: boolean
}

export const RoflAppStatusBadge = ({ hasActiveInstances, removed }: RoflAppStatusBadgeProps) => {
  const { t } = useTranslation()
  const status = getRoflAppStatus(hasActiveInstances, removed)
  const statusLabel: Record<RoflAppStatusTypes, string> = {
    active: t('rofl.active'),
    inactive: t('rofl.inactive'),
    removed: t('rofl.removed'),
  }

  return <StatusBadge label={statusLabel[status]} icon={statusIcon[status]} variant={statusVariant[status]} />
}
