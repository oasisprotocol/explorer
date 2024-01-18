import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { startOfMonth } from 'date-fns/startOfMonth'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { SnapshotCardDurationLabel } from '../../components/Snapshots/SnapshotCardDurationLabel'
import { BarChart } from '../../components/charts/BarChart'
import { useGetLayerStatsActiveAccounts, type ActiveAccounts as Windows } from '../../../oasis-nexus/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  dailyLimitWithoutBuffer,
  durationToQueryParams,
  filterHourlyActiveAccounts,
  sumWindowsByStartDuration,
} from '../../utils/chart-utils'
import { SearchScope } from '../../../types/searchScope'

export const getActiveAccountsWindows = (duration: ChartDuration, windows: Windows[]) => {
  switch (duration) {
    case ChartDuration.TODAY:
      return filterHourlyActiveAccounts(windows)
    case ChartDuration.YEAR:
      return sumWindowsByStartDuration(windows, 'active_accounts', 'window_end', startOfMonth)
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
    case ChartDuration.YEAR:
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
  scope: SearchScope
  chartDuration: ChartDuration
}

const getLabels = (t: TFunction): Record<ChartDuration, string> => ({
  [ChartDuration.TODAY]: t('chartDuration.lastHour'),
  [ChartDuration.WEEK]: t('chartDuration.lastDay'),
  [ChartDuration.MONTH]: t('chartDuration.lastDay'),
  [ChartDuration.YEAR]: t('chartDuration.lastMonth'),
})

export const ActiveAccounts: FC<ActiveAccountsProps> = ({ scope, chartDuration }) => {
  const { t } = useTranslation()
  const labels = getLabels(t)
  const { limit, window_step_seconds } = {
    ...durationToQueryParams[chartDuration],
    // By default we fetch data with additional buffer, but it does not apply to active accounts.
    // Active accounts daily windows are overlapping, so we cannot sum windows like in other daily charts.
    limit:
      chartDuration === ChartDuration.TODAY
        ? dailyLimitWithoutBuffer
        : durationToQueryParams[chartDuration].limit,
  }
  const activeAccountsQuery = useGetLayerStatsActiveAccounts(
    scope.network,
    scope.layer,
    {
      limit,
      window_step_seconds,
    },
    {
      query: {
        keepPreviousData: true,
        staleTime: chartUseQueryStaleTimeMs,
      },
    },
  )
  const weeklyChart = activeAccountsQuery.isFetched && chartDuration === ChartDuration.WEEK
  const windows =
    activeAccountsQuery.data?.data?.windows &&
    getActiveAccountsWindows(chartDuration, activeAccountsQuery.data?.data?.windows)

  return (
    <SnapshotCard
      title={t('activeAccounts.title')}
      label={
        <SnapshotCardDurationLabel
          label={labels[chartDuration]}
          value={windows?.length && windows[0].active_accounts}
        />
      }
    >
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
