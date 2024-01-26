import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const SnapshotDelegators: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.delegators')}>
      {/* TODO: provide delegators number when API is ready */}-
    </SnapshotTextCard>
  )
}
