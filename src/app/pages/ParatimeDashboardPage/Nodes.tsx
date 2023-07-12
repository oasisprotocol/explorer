import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import InfoIcon from '@mui/icons-material/Info'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { Layer, useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { paraTimesConfig } from '../../../config'
import { SearchScope } from '../../../types/searchScope'

export const Nodes: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const runtimeStatusQuery = useGetRuntimeStatus(scope.network, scope.layer)
  const activeNodes = runtimeStatusQuery.data?.data?.active_nodes
  const hasActiveNodes = true // temporary workaround for BE bug
  // const hasActiveNodes = activeNodes !== 0 // This includes undefined while loading
  const title = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        pr: 4,
      }}
    >
      {t('nodes.title')}
      <Tooltip
        arrow
        placement="top"
        title={hasActiveNodes ? t('nodes.tooltip') : t('nodes.unknown')}
        enterDelay={tooltipDelay}
        enterNextDelay={tooltipDelay}
      >
        <InfoIcon htmlColor={COLORS.brandDark} />
      </Tooltip>
    </Box>
  )

  return (
    <SnapshotCard title={title}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {runtimeStatusQuery.isFetched && (
          <>
            <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
            <Typography
              component="span"
              sx={{
                fontSize: '48px',
                fontWeight: 700,
                color: hasActiveNodes ? COLORS.brandDark : COLORS.grayMedium,
              }}
            >
              {hasActiveNodes
                ? t('nodes.value', {
                    value: activeNodes || paraTimesConfig[scope.layer][scope.network].activeNodes,
                  })
                : '-'}
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
