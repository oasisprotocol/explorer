import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { SnapshotCard } from './SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { Layer, useGetRuntimeStatus } from '../../../oasis-indexer/api'
import { AppErrors } from '../../../types/errors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'

export const Nodes: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const runtimeStatusQuery = useGetRuntimeStatus(scope.network, scope.layer)
  const activeNodes = runtimeStatusQuery.data?.data?.active_nodes

  return (
    <SnapshotCard title={t('nodes.title')}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {runtimeStatusQuery.isFetched && (
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
