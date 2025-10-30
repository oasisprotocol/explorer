import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import InfoIcon from '@mui/icons-material/Info'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { RuntimeScope } from '../../../types/searchScope'

export const Nodes: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { data, isFetched } = useGetRuntimeStatus(scope.network, scope.layer)
  const activeNodes = data?.data.active_nodes
  const title = (
    <div className="flex justify-between items-center w-full">
      {t('nodes.title')}
      <Tooltip title={t('nodes.tooltip')}>
        <InfoIcon htmlColor={COLORS.brandDark} />
      </Tooltip>
    </div>
  )

  return (
    <SnapshotCard title={title}>
      <div className="flex items-center justify-center h-full">
        {isFetched && activeNodes !== undefined && (
          <>
            <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
            <Typography className="text-primary text-center text-2xl font-semibold">
              {t('nodes.value', { value: activeNodes })}
            </Typography>
          </>
        )}
      </div>
    </SnapshotCard>
  )
}
