import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const SnapshotStaked: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.staked')}>
      {/* TODO: provide label and staked values when API is ready */}-
    </SnapshotTextCard>
  )
}
