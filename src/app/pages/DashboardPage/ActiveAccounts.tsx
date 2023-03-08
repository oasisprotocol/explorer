import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCard } from './SnapshotCard'
import { BarChart } from '../../components/charts/BarChart'
import { Runtime, useGetLayerStatsActiveAccounts } from '../../../oasis-indexer/api'
import { ChartDuration, chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'

type ActiveAccountsProps = {
  chartDuration: ChartDuration
}

export const ActiveAccounts: FC<ActiveAccountsProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  // TODO: sync with BE when filters are working
  const { limit } = durationToQueryParams[chartDuration]
  const activeAccountsQuery = useGetLayerStatsActiveAccounts(
    Runtime.emerald,
    {
      limit,
    },
    {
      query: {
        keepPreviousData: true,
        staleTime: chartUseQueryStaleTimeMs,
      },
    },
  )
  const buckets = activeAccountsQuery.data?.data?.windows
  const totalNumberLabel = buckets?.reduce((acc, curr) => acc + curr.active_accounts, 0).toLocaleString()

  return (
    <SnapshotCard title={t('activeAccounts.title')} label={totalNumberLabel}>
      {buckets && (
        <BarChart
          data={buckets.slice().reverse()}
          dataKey="active_accounts"
          formatters={{
            data: (value: number) =>
              t('activeAccounts.tooltip', {
                value,
              }),
            label: (value: string) =>
              t('common.formattedDateTime', {
                timestamp: new Date(value),
              }),
          }}
          withBarBackground
        />
      )}
    </SnapshotCard>
  )
}
