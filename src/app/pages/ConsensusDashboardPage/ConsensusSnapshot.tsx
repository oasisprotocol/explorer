import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { Snapshot, StyledGrid } from '../../components/Snapshots/Snapshot'
import { SnapshotEpoch } from './SnapshotEpoch'
import { SnapshotDelegators } from './SnapshotDelegators'
import { SnapshotValidators } from './SnapshotValidators'
import { SnapshotStaked } from './SnapshotStaked'

export const ConsensusSnapshot: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Snapshot title={t('consensusSnapshot')} scope={scope}>
      <StyledGrid item xs={22} md={5}>
        <SnapshotEpoch />
      </StyledGrid>
      <StyledGrid item xs={22} md={6}>
        <SnapshotValidators scope={scope} />
      </StyledGrid>
      <StyledGrid item xs={22} md={5}>
        <SnapshotDelegators />
      </StyledGrid>
      <StyledGrid item xs={22} md={6}>
        <SnapshotStaked />
      </StyledGrid>
    </Snapshot>
  )
}
