import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Zap } from 'lucide-react'
import { Info } from 'lucide-react'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
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
        <Info size="18" className="stroke-zinc-500" />
      </Tooltip>
    </div>
  )

  return (
    <SnapshotCard title={title}>
      <div className="flex items-center justify-center h-full">
        {isFetched && activeNodes !== undefined && (
          <>
            <div className="rounded-full w-8 h-8 bg-[#4cd4a9] flex items-center justify-center mr-4">
              <Zap color="white" size={20} />
            </div>
            <Typography className="text-primary text-center text-2xl font-semibold">
              {t('nodes.value', { value: activeNodes })}
            </Typography>
          </>
        )}
      </div>
    </SnapshotCard>
  )
}
