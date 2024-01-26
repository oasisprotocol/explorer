import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const SnapshotEpoch: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('currentEpoch')}>
      {/* TODO: provide epoch number when API is ready */}-
    </SnapshotTextCard>
  )
}
