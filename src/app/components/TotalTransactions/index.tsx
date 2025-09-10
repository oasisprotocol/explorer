import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../charts/LineChart'
import { useGetLayerStatsTxVolume } from '../../../oasis-nexus/api'
import { chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { DurationPills } from '../DurationPills'
import { ChartDuration, cumulativeSum } from '../../utils/chart-utils'
import { SearchScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

const TotalTransactionsContent: FC<{
  scope: SearchScope
  chartDuration: ChartDuration
}> = ({ scope, chartDuration }) => {
  const { t } = useTranslation()
  const statsParams = {
    ...durationToQueryParams[chartDuration],
    // We want to start from the beginning of offset as cumulative sum generates a line chart that always goes up
    offset: 0,
  }
  const dailyVolumeQuery = useGetLayerStatsTxVolume(scope.network, scope.layer, statsParams, {
    query: {
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })

  const windows = dailyVolumeQuery.data?.data.windows
    ? cumulativeSum(dailyVolumeQuery.data?.data.windows.slice().reverse(), 'tx_volume')
    : undefined

  return (
    windows && (
      <LineChart
        tooltipActiveDotRadius={9}
        cartesianGrid
        strokeWidth={3}
        dataKey="tx_volume"
        data={windows}
        margin={{ bottom: 16, top: 16 }}
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
    )
  )
}

export const TotalTransactions: FC<{ chartContainerHeight?: number; scope: SearchScope }> = ({
  chartContainerHeight = 450,
  scope,
}) => {
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.MONTH)
  return (
    <Card sx={{ flex: 1 }}>
      <div className="flex flex-col mb-4 sm:flex-row sm:items-center sm:justify-between gap-1">
        <Typography variant="h3">{t('totalTransactions.header')}</Typography>

        <div className="md:ml-4 md:flex-1 md:text-right">
          <DurationPills handleChange={setChartDuration} value={chartDuration} />
        </div>
      </div>
      <CardContent sx={{ height: chartContainerHeight }}>
        <ErrorBoundary light>
          <TotalTransactionsContent scope={scope} chartDuration={chartDuration} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
