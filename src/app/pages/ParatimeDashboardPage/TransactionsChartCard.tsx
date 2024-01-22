import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useGetLayerStatsTxVolume } from '../../../oasis-nexus/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  sumWindowsByStartDuration,
} from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC, memo } from 'react'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { SnapshotCardDurationLabel } from '../../components/Snapshots/SnapshotCardDurationLabel'
import { PercentageGain } from '../../components/PercentageGain'
import { startOfHour } from 'date-fns/startOfHour'
import { SearchScope } from '../../../types/searchScope'

const getLabels = (t: TFunction): Record<ChartDuration, string> => ({
  [ChartDuration.TODAY]: t('chartDuration.lastHour'),
  [ChartDuration.WEEK]: t('chartDuration.lastDay'),
  [ChartDuration.MONTH]: t('chartDuration.lastDay'),
  [ChartDuration.YEAR]: t('chartDuration.lastDay'),
})

interface TransactionsChartCardProps {
  scope: SearchScope
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ scope, chartDuration }) => {
  const { t } = useTranslation()
  const labels = getLabels(t)
  const { isMobile } = useScreenSize()
  const statsParams = durationToQueryParams[chartDuration]
  const { data, isFetched } = useGetLayerStatsTxVolume(scope.network, scope.layer, statsParams, {
    query: { staleTime: chartUseQueryStaleTimeMs },
  })

  const isDailyChart = isFetched && chartDuration === ChartDuration.TODAY
  const windows = data?.data?.windows
  const lineChartData = isDailyChart
    ? sumWindowsByStartDuration(windows, 'tx_volume', 'window_end', startOfHour)
    : windows
  const formatParams = isDailyChart
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
    <SnapshotCard
      title={t('common.transactions')}
      badge={
        lineChartData &&
        lineChartData.length >= 2 && (
          <PercentageGain
            earliestValue={lineChartData[lineChartData.length - 1].tx_volume}
            latestValue={lineChartData[0].tx_volume}
          />
        )
      }
      label={
        <SnapshotCardDurationLabel
          label={labels[chartDuration]}
          value={lineChartData?.length && lineChartData[0].tx_volume}
        />
      }
    >
      {lineChartData && (
        <LineChart
          dataKey="tx_volume"
          data={lineChartData.slice().reverse()}
          margin={{ left: 0, right: isMobile ? 80 : 40 }}
          formatters={{
            data: (value: number) =>
              isDailyChart
                ? t('transactionStats.perHour', {
                    value: value.toLocaleString(),
                  })
                : t('transactionStats.perDay', {
                    value: value.toLocaleString(),
                  }),
            label: (value: string) =>
              t('common.formattedDateTime', {
                timestamp: new Date(value),
                formatParams,
              }),
          }}
        />
      )}
    </SnapshotCard>
  )
}

export const TransactionsChartCard = memo(TransactionsChartCardCmp)
