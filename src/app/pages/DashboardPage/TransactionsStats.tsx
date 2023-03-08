import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { BarChart } from '../../components/charts/BarChart'
import { useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import {
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  getMonthlyBucketsDailyAverage,
} from '../../utils/chart-utils'
import { DurationPills } from './DurationPills'
import { CardHeaderWithResponsiveActions } from './CardHeaderWithResponsiveActions'
import { ChartDuration } from '../../utils/chart-utils'
import { useLayerParam } from '../../hooks/useLayerParam'

export const TransactionsStats: FC = () => {
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.MONTH)
  const statsParams = durationToQueryParams[chartDuration]
  const layer = useLayerParam()
  const dailyVolumeQuery = useGetLayerStatsTxVolume(layer, statsParams, {
    query: {
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })
  const allTime = dailyVolumeQuery.isFetched && chartDuration === ChartDuration.ALL_TIME
  const buckets = allTime
    ? getMonthlyBucketsDailyAverage(dailyVolumeQuery.data?.data.buckets)
    : dailyVolumeQuery.data?.data.buckets
  const formatParams = allTime
    ? {
        timestamp: {
          year: 'numeric',
          month: 'long',
        } satisfies Intl.DateTimeFormatOptions,
      }
    : undefined

  return (
    <Card>
      <CardHeaderWithResponsiveActions
        action={<DurationPills handleChange={setChartDuration} value={chartDuration} />}
        disableTypography
        component="h3"
        title={t('transactionStats.header')}
      />
      <CardContent sx={{ height: 450 }}>
        {buckets && (
          <BarChart
            barSize={chartDuration === ChartDuration.WEEK ? 125 : undefined}
            barRadius={chartDuration === ChartDuration.WEEK ? 20 : undefined}
            cartesianGrid
            data={buckets.slice().reverse()}
            dataKey="tx_volume"
            formatters={{
              data: (value: number) => t('transactionStats.tooltip', { value: value.toLocaleString() }),
              label: (value: string) =>
                t('common.formattedDateTime', {
                  timestamp: new Date(value),
                  formatParams,
                }),
            }}
            withLabels
          />
        )}
      </CardContent>
    </Card>
  )
}
