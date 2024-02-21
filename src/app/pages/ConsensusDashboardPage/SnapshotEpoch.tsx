import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useGetStatus } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const SnapshotEpoch: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const statusQuery = useGetStatus(scope.network)
  const blockHeight = statusQuery?.data?.data.latest_block

  return (
    <SnapshotTextCard
      title={t('currentEpoch')}
      label={
        blockHeight && (
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
      {/* TODO: provide epoch number when API is ready */}-
    </SnapshotTextCard>
  )
}
