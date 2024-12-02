import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

type SnapshotDelegatorsProps = {
  totalDelegators: number | undefined
}

export const SnapshotDelegators: FC<SnapshotDelegatorsProps> = ({ totalDelegators }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.delegators')} withConstantHeight>
      {typeof totalDelegators === 'number' && totalDelegators.toLocaleString()}
    </SnapshotTextCard>
  )
}
