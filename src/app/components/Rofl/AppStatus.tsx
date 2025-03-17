import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { StatusBadge, StatusVariant } from '../common/StatusBadge'

type RoflAppStatusTypes = 'active' | 'inactive' | 'removed'

const statusVariant: Record<RoflAppStatusTypes, StatusVariant> = {
  active: 'success',
  inactive: 'warning',
  removed: 'danger',
}

const statusIcon: Partial<Record<RoflAppStatusTypes, ReactNode>> = {
  inactive: <CheckCircleIcon color="warning" fontSize="small" />,
}

type AppStatusProps = {
  status: RoflAppStatusTypes
}

export const AppStatus = ({ status }: AppStatusProps) => {
  const { t } = useTranslation()
  const statusLabel: Record<RoflAppStatusTypes, string> = {
    active: t('rofl.active'),
    inactive: t('rofl.inactive'),
    removed: t('rofl.removed'),
  }

  return <StatusBadge label={statusLabel[status]} icon={statusIcon[status]} variant={statusVariant[status]} />
}
