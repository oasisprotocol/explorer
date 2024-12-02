import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const UptimeCard: FC = () => {
  const { t } = useTranslation()

  return <SnapshotTextCard title={t('validator.uptime')}>{t('common.missing')}</SnapshotTextCard>
}
