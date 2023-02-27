import { useTranslation } from 'react-i18next'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import { ChartDuration, chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FC, memo } from 'react'
import { SnapshotCard } from './SnapshotCard'
import { PercentageGain } from '../../components/PercentageGain'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const statsParams = durationToQueryParams[chartDuration]
  const { data } = useGetLayerStatsTxVolume(Layer.emerald, statsParams, {
    query: { staleTime: chartUseQueryStaleTimeMs },
  })

  const lineChartData = data?.data.buckets.map(bucket => {
    return {
      bucket_start: bucket.bucket_start,
      volume_per_second: bucket.tx_volume / statsParams.bucket_size_seconds,
    }
  })

  const totalTransactions = data?.data.buckets.reduce((acc, curr) => acc + curr.tx_volume, 0) ?? 0

  const getPercentageDiff = (): number | null => {
    if (!lineChartData?.length || lineChartData?.length < 2) {
      return null
    }

    const [earliestBucket] = lineChartData
    const latestBucket = lineChartData[lineChartData.length - 1]

    return (
      ((earliestBucket.volume_per_second - latestBucket.volume_per_second) / latestBucket.volume_per_second) *
      100
    )
  }

  const percentage = getPercentageDiff()

  return (
    <SnapshotCard
      title={t('common.transactions')}
      badge={percentage !== null && <PercentageGain percentage={percentage} />}
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
              }),
          }}
        />
      )}
    </SnapshotCard>
  )
}

export const TransactionsChartCard = memo(TransactionsChartCardCmp)
