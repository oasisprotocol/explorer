import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCard } from './SnapshotCard'
import { BarChart } from '../../components/charts/BarChart'
import {
  Runtime,
  useGetLayerStatsActiveAccounts,
  GetLayerStatsActiveAccountsWindowStepSeconds,
} from '../../../oasis-indexer/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  filterHourlyActiveAccounts,
} from '../../utils/chart-utils'

type ActiveAccountsProps = {
  chartDuration: ChartDuration
}

export const ActiveAccounts: FC<ActiveAccountsProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const { limit, bucket_size_seconds } = durationToQueryParams[chartDuration]
  const activeAccountsQuery = useGetLayerStatsActiveAccounts(
    Runtime.emerald,
    {
      limit,
      window_step_seconds: bucket_size_seconds as GetLayerStatsActiveAccountsWindowStepSeconds,
    },
    {
      query: {
        keepPreviousData: true,
        staleTime: chartUseQueryStaleTimeMs,
      },
    },
  )
  const weeklyChart = activeAccountsQuery.isFetched && chartDuration === ChartDuration.WEEK
  const dailyChart = activeAccountsQuery.isFetched && chartDuration === ChartDuration.TODAY
  const windows = dailyChart
    ? filterHourlyActiveAccounts(activeAccountsQuery.data?.data?.windows)
    : activeAccountsQuery.data?.data?.windows
  const totalNumberLabel =
    dailyChart && windows?.length
      ? windows[0].active_accounts.toLocaleString()
      : windows?.reduce((acc, curr) => acc + curr.active_accounts, 0).toLocaleString()
  const formatParams = dailyChart
    ? {
        timestamp: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        } satisfies Intl.DateTimeFormatOptions,
      }
    : undefined

  return (
    <SnapshotCard title={t('activeAccounts.title')} label={totalNumberLabel}>
      {windows && (
        <BarChart
          barSize={!weeklyChart ? 8 : undefined}
          data={windows.slice().reverse()}
          dataKey="active_accounts"
          formatters={{
            data: (value: number) =>
              t('activeAccounts.tooltip', {
                value,
              }),
            label: (value: string) =>
              t('common.formattedDateTime', {
                timestamp: new Date(value),
                formatParams,
              }),
          }}
          withBarBackground
        />
      )}
    </SnapshotCard>
  )
}
