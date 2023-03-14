import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { SnapshotCard } from './SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { Runtime, useGetRuntimeStatus } from '../../../oasis-indexer/api'

export const Nodes: FC = () => {
  const { t } = useTranslation()
  const runtimeStatusQuery = useGetRuntimeStatus(Runtime.emerald)
  const activeNodes = runtimeStatusQuery.data?.data?.active_nodes

  return (
    <SnapshotCard title={t('nodes.title')}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activeNodes && (
          <>
            <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
            <Typography component="span" sx={{ fontSize: '48px', fontWeight: 700, color: COLORS.brandDark }}>
              {t('nodes.value', { value: activeNodes })}
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
