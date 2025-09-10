import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useGetConsensusEpochs } from '../../../oasis-nexus/api'
import { useGetStatus } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { BrandProgressBar } from '../../components/ProgressBar'

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
  let percentageValue = undefined

  if (epochs && epochs[1]?.end_height && blockHeight) {
    const epochDiffHeight = epochs[1]?.end_height - epochs[1]?.start_height
    const completedBlocksInCurrentEpoch = blockHeight - epochs[0]?.start_height
    percentageValue = completedBlocksInCurrentEpoch / epochDiffHeight
  }

  return (
    <SnapshotTextCard
      title={t('currentEpoch')}
      label={
        blockHeight !== undefined && (
          <Typography className="font-normal flex gap-2 items-center">
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
        )
      }
    >
      {epoch !== undefined && (
        <>
          {percentageValue !== undefined && (
            <div className="-mt-2 mb-2">
              <BrandProgressBar value={percentageValue * 100} variant="determinate" />
            </div>
          )}
          <div className="flex items-baseline gap-2">
            {epoch.toLocaleString()}
            {percentageValue !== undefined && (
              <Typography variant="xsmall" textColor="muted">
                (
                {t('common.valuePair', {
                  value: percentageValue,
                  formatParams: {
                    value: {
                      style: 'percent',
                    } satisfies Intl.NumberFormatOptions,
                  },
                })}
                )
              </Typography>
            )}
          </div>
        </>
      )}
    </SnapshotTextCard>
  )
}
