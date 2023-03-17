import { useTranslation } from 'react-i18next'
import { useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import {
  ChartDuration,
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  sumBucketsByStartDuration,
} from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FC, memo } from 'react'
import { SnapshotCard } from './SnapshotCard'
import { PercentageGain } from '../../components/PercentageGain'
import startOfHour from 'date-fns/startOfHour'
import { useLayerParam } from '../../hooks/useLayerParam'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const statsParams = durationToQueryParams[chartDuration]
  const layer = useLayerParam()
  const { data, isFetched } = useGetLayerStatsTxVolume(layer, statsParams, {
    query: { staleTime: chartUseQueryStaleTimeMs },
  })

  const isDailyChart = isFetched && chartDuration === ChartDuration.TODAY

  const buckets = data?.data.buckets.map(bucket => {
    return {
      bucket_start: bucket.bucket_start,
      volume_per_second: bucket.tx_volume / statsParams.bucket_size_seconds,
    }
  })
  const totalTransactions = data?.data.buckets.reduce((acc, curr) => acc + curr.tx_volume, 0) ?? 0

  const lineChartData = isDailyChart
    ? sumBucketsByStartDuration(buckets, 'volume_per_second', 'bucket_start', startOfHour)
    : buckets

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
            earliestValue={lineChartData[lineChartData.length - 1].volume_per_second}
            latestValue={lineChartData[0].volume_per_second}
          />
        )
      }
      label={totalTransactions.toLocaleString()}
    >
      {lineChartData && (
        <LineChart
          dataKey="volume_per_second"
          data={lineChartData.slice().reverse()}
          margin={{ left: 0, right: isMobile ? 80 : 40 }}
          formatters={{
            data: (value: number) =>
              t('transactionsTpsChart.tooltip', {
                value,
                formatParams: {
                  value: {
                    maximumFractionDigits: 2,
                  } satisfies Intl.NumberFormatOptions,
                },
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
