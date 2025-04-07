import { useTranslation } from 'react-i18next'
import { StatusBadge } from '../common/StatusBadge'

type RoflAppInstanceStatusBadgeProps = {
  isActive: boolean
}

export const RoflAppInstanceStatusBadge = ({ isActive }: RoflAppInstanceStatusBadgeProps) => {
  const { t } = useTranslation()

  return (
    <StatusBadge
      label={isActive ? t('rofl.active') : t('rofl.expired')}
      variant={isActive ? 'success' : 'danger'}
    />
  )
}
