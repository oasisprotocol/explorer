import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { Snapshot, StyledGrid } from '../../components/Snapshots/Snapshot'
import { API_MAX_TOTAL_COUNT } from '../../config'
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
      <StyledGrid item xs={22} md={5}>
        <SnapshotEpoch scope={scope} />
      </StyledGrid>
      <StyledGrid item xs={22} md={6}>
        <SnapshotValidators validators={validators} />
      </StyledGrid>
      <StyledGrid item xs={22} md={5}>
        <SnapshotDelegators totalDelegators={stats?.total_delegators} />
      </StyledGrid>
      <StyledGrid item xs={22} md={6}>
        <SnapshotStaked totalStaked={stats?.total_staked_balance} ticker={stats?.ticker} />
      </StyledGrid>
    </Snapshot>
  )
}
