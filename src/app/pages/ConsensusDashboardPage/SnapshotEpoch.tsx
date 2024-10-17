import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useGetConsensusEpochs } from '../../../oasis-nexus/api'
import { useGetStatus } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { BrandProgressBar } from '../../components/ProgressBar'

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: `-${theme.spacing(3)}`,
  marginBottom: theme.spacing(3),
}))

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>
              <Trans
                t={t}
                i18nKey="consensusSnapshot.blockHeight"
                components={{
                  BlockHeight: (
                    <Typography component="span" sx={{ fontSize: '24px', color: COLORS.grayExtraDark }}>
                      {blockHeight.toLocaleString()}
                    </Typography>
                  ),
                }}
              />
            </Typography>
          </Box>
        )
      }
    >
      {epoch !== undefined && (
        <>
          {percentageValue !== undefined && (
            <StyledBox>
              <BrandProgressBar value={percentageValue * 100} variant="determinate" />
            </StyledBox>
          )}
          <Box gap={3} sx={{ display: 'flex', alignItems: 'baseline' }}>
            {epoch.toLocaleString()}
            {percentageValue !== undefined && (
              <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>
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
          </Box>
        </>
      )}
    </SnapshotTextCard>
  )
}
