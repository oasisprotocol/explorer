import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import { chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { DurationPills } from './DurationPills'
import { CardHeaderWithResponsiveActions } from './CardHeaderWithResponsiveActions'
import { ChartDuration, cumulativeSum } from '../../utils/chart-utils'
import { useLayerParam } from '../../hooks/useLayerParam'

export const TotalTransactions: FC = () => {
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
  const buckets = dailyVolumeQuery.data?.data.buckets
    ? cumulativeSum(dailyVolumeQuery.data?.data.buckets.slice().reverse(), 'tx_volume')
    : undefined

  return (
    <Card>
      <CardHeaderWithResponsiveActions
        action={<DurationPills handleChange={setChartDuration} value={chartDuration} />}
        disableTypography
        component="h3"
        title={t('totalTransactions.header')}
      />
      <CardContent sx={{ height: 450 }}>
        {buckets && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey="tx_volume"
            data={buckets}
            margin={{ left: 16, right: 0 }}
            tickMargin={16}
            withLabels
            formatters={{
              data: (value: number) =>
                t('totalTransactions.tooltip', {
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
      </CardContent>
    </Card>
  )
}
