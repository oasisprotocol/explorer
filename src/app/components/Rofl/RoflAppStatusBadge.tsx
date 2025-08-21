import { useTranslation } from 'react-i18next'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

type RoflAppStatusTypes = 'active' | 'inactive' | 'removed'

function getRoflAppStatus(hasActiveInstances: boolean, removed: boolean): RoflAppStatusTypes {
  if (removed) return 'removed'
  return hasActiveInstances ? 'active' : 'inactive'
}

const statusVariant: Record<RoflAppStatusTypes, 'success' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'warning',
  removed: 'error',
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

  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
}
