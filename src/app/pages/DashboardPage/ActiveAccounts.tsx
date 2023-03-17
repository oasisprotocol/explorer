import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import startOfMonth from 'date-fns/startOfMonth'
import { SnapshotCard } from './SnapshotCard'
import { BarChart } from '../../components/charts/BarChart'
import {
  useGetLayerStatsActiveAccounts,
  GetLayerStatsActiveAccountsWindowStepSeconds,
  type ActiveAccounts as Windows,
} from '../../../oasis-indexer/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  filterHourlyActiveAccounts,
  sumBucketsByStartDuration,
} from '../../utils/chart-utils'
import { useLayerParam } from '../../hooks/useLayerParam'

export const getActiveAccountsWindows = (duration: ChartDuration, windows: Windows[]) => {
  switch (duration) {
    case ChartDuration.TODAY:
      return filterHourlyActiveAccounts(windows)
    case ChartDuration.ALL_TIME:
      return sumBucketsByStartDuration(windows, 'active_accounts', 'window_end', startOfMonth)
    default:
      return windows
  }
}

export const getChartLabelFormatParams = (duration: ChartDuration) => {
  switch (duration) {
    case ChartDuration.TODAY:
      return {
        timestamp: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        } satisfies Intl.DateTimeFormatOptions,
      }
    case ChartDuration.ALL_TIME:
      return {
        timestamp: {
          year: 'numeric',
          month: 'long',
        } satisfies Intl.DateTimeFormatOptions,
      }
    default:
      return undefined
  }
}

type ActiveAccountsProps = {
  chartDuration: ChartDuration
}

export const ActiveAccounts: FC<ActiveAccountsProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const { limit, bucket_size_seconds } = durationToQueryParams[chartDuration]
  const layer = useLayerParam()
  const activeAccountsQuery = useGetLayerStatsActiveAccounts(
    layer,
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
  const windows =
    activeAccountsQuery.data?.data?.windows &&
    getActiveAccountsWindows(chartDuration, activeAccountsQuery.data?.data?.windows)
  const totalNumberLabel =
    dailyChart && windows?.length
      ? windows[0].active_accounts.toLocaleString()
      : windows?.reduce((acc, curr) => acc + curr.active_accounts, 0).toLocaleString()

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
                formatParams: getChartLabelFormatParams(chartDuration),
              }),
          }}
          withBarBackground
        />
      )}
    </SnapshotCard>
  )
}
