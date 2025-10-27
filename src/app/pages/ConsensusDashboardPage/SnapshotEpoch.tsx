import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useGetConsensusEpochs } from '../../../oasis-nexus/api'
import { useGetStatus } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { PercentageValue } from '../../components/PercentageValue'
import { LabeledProgress } from '../../components/LabeledProgress'

// We need to get the previous epoch to compute end_height for the current one
// This may not be precise during abnormal network conditions, but such conditions never happened so far
const epochsLimit = 2

export const SnapshotEpoch: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const statusQuery = useGetStatus(scope.network)
  const blockHeight = statusQuery?.data?.data.latest_block
  const epochsQuery = useGetConsensusEpochs(scope.network, { limit: epochsLimit })
  const epochs = epochsQuery.data?.data.epochs
  const epoch = epochs?.length && epochs[0].id
  let epochDiffHeight = undefined
  let completedBlocksInCurrentEpoch = undefined

  if (epochs && epochs[1]?.end_height && blockHeight) {
    epochDiffHeight = epochs[1]?.end_height - epochs[1]?.start_height + 1
    completedBlocksInCurrentEpoch = blockHeight - epochs[0]?.start_height
  }

  return (
    <SnapshotTextCard
      title={t('snapshotEpochTitle')}
      withContentPadding={false}
      label={
        blockHeight !== undefined && (
          <>
            <Typography className="font-normal flex gap-2 justify-between items-center min-h-7">
              <Trans
                t={t}
                i18nKey="consensusSnapshot.currentEpoch"
                components={{
                  EpochNumber: <span className="font-semibold text-primary">{epoch?.toLocaleString()}</span>,
                }}
              />
            </Typography>
            <Typography className="font-normal flex gap-2 justify-between items-center min-h-7">
              <Trans
                t={t}
                i18nKey="consensusSnapshot.blockHeight"
                components={{
                  BlockHeight: (
                    <span className="font-semibold text-primary">{blockHeight.toLocaleString()}</span>
                  ),
                }}
              />
            </Typography>
          </>
        )
      }
    >
      {epoch !== undefined && (
        <LabeledProgress
          value={completedBlocksInCurrentEpoch}
          max={epochDiffHeight}
          label={
            <>
              <span className="font-bold">{completedBlocksInCurrentEpoch}</span>/{epochDiffHeight} (
              <PercentageValue
                value={completedBlocksInCurrentEpoch}
                total={epochDiffHeight}
                maximumFractionDigits={1}
              />
              )
            </>
          }
        />
      )}
    </SnapshotTextCard>
  )
}
