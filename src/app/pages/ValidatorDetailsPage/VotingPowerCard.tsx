import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const VotingPowerCard: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.votingPower')}>
      {/* TODO: provide voting power stats when API is ready */}-
    </SnapshotTextCard>
  )
}
