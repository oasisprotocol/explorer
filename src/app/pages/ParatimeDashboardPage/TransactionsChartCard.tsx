import { useTranslation } from 'react-i18next'
import { useGetLayerStatsTxVolume } from '../../../oasis-nexus/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  sumBucketsByStartDuration,
} from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC, memo } from 'react'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { PercentageGain } from '../../components/PercentageGain'
import startOfHour from 'date-fns/startOfHour'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const statsParams = durationToQueryParams[chartDuration]
  const scope = useRequiredScopeParam()
  const { data, isFetched } = useGetLayerStatsTxVolume(scope.network, scope.layer, statsParams, {
    query: { staleTime: chartUseQueryStaleTimeMs },
  })

  const isDailyChart = isFetched && chartDuration === ChartDuration.TODAY
  const buckets = data?.data?.buckets
  const lineChartData = isDailyChart
    ? sumBucketsByStartDuration(buckets, 'tx_volume', 'bucket_start', startOfHour)
    : buckets
  const cardLabel = lineChartData?.length ? lineChartData[0].tx_volume?.toLocaleString() : ''

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
      label={cardLabel}
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
