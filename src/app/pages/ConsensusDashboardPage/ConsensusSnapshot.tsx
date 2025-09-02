import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { Snapshot } from '../../components/Snapshots/Snapshot'
import { API_MAX_TOTAL_COUNT } from '../../../config'
import { SnapshotEpoch } from './SnapshotEpoch'
import { SnapshotDelegators } from './SnapshotDelegators'
import { SnapshotValidators } from './SnapshotValidators'
import { SnapshotStaked } from './SnapshotStaked'

export const ConsensusSnapshot: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const validatorsQuery = useGetConsensusValidators(scope.network, { limit: API_MAX_TOTAL_COUNT })
  const validators = validatorsQuery.data?.data.validators
  const stats = validatorsQuery.data?.data.stats

  return (
    <Snapshot title={t('consensusSnapshot.title')} scope={scope}>
      <div className="col-span-12 lg:col-span-3">
        <SnapshotEpoch scope={scope} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <SnapshotValidators validators={validators} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <SnapshotDelegators totalDelegators={stats?.total_delegators} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <SnapshotStaked totalStaked={stats?.total_staked_balance} ticker={stats?.ticker} />
      </div>
    </Snapshot>
  )
}
