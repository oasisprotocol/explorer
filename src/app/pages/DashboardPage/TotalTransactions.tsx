import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import { chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { DurationPills } from './DurationPills'
import { CardHeaderWithResponsiveActions } from './CardHeaderWithResponsiveActions'
import { ChartDuration } from '../../utils/chart-utils'

export const TotalTransactions: FC = () => {
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.WEEK)
  const statsParams = durationToQueryParams[chartDuration]
  const dailyVolumeQuery = useGetLayerStatsTxVolume(Layer.emerald, statsParams, {
    query: {
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })

  return (
    <Card>
      <CardHeaderWithResponsiveActions
        action={<DurationPills handleChange={setChartDuration} value={chartDuration} />}
        disableTypography
        component="h3"
        title={t('totalTransactions.header')}
      />
      <CardContent sx={{ height: 450 }}>
        {dailyVolumeQuery.data?.data.buckets && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey="tx_volume"
            data={dailyVolumeQuery.data?.data.buckets.slice().reverse()}
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
