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
import { SearchScope } from '../../../types/searchScope'

export const Nodes: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const { data, isFetched } = useGetRuntimeStatus(scope.network, scope.layer)
  const activeNodes = data?.data.active_nodes
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
        title={t('nodes.tooltip')}
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
        {isFetched && activeNodes !== undefined && (
          <>
            <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
            <Typography
              component="span"
              sx={{
                fontSize: '48px',
                fontWeight: 700,
                color: COLORS.brandDark,
              }}
            >
              {t('nodes.value', { value: activeNodes })}
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
