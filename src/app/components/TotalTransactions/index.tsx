import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { LineChart } from '../charts/LineChart'
import { Layer, useGetLayerStatsTxVolume, useGetStatsTxVolume } from '../../../oasis-nexus/api'
import { chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { DurationPills } from '../DurationPills'
import { ChartDuration, cumulativeSum } from '../../utils/chart-utils'
import { SearchScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Network } from '../../../types/network'

const TotalTransactionsContent: FC<{
  scope: { network: Network; layer?: Layer }
  chartDuration: ChartDuration
}> = ({ scope, chartDuration }) => {
  const { t } = useTranslation()
  const statsParams = {
    ...durationToQueryParams[chartDuration],
    // We want to start from the beginning of offset as cumulative sum generates a line chart that always goes up
    offset: 0,
  }

  const layerVolumeQuery = useGetLayerStatsTxVolume(scope.network, scope.layer!, statsParams, {
    query: {
      enabled: !!scope.layer,
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })

  const networkVolumeQuery = useGetStatsTxVolume(scope.network, statsParams, {
    query: {
      enabled: !scope.layer,
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })

  const dailyVolumeQuery = scope.layer ? layerVolumeQuery : networkVolumeQuery

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

type TotalTransactionsProps = {
  title?: ReactNode
  chartContainerHeight?: number
} & ({ scope: SearchScope } | { network: Network })

export const TotalTransactions: FC<TotalTransactionsProps> = ({
  chartContainerHeight = 450,
  title,
  ...props
}) => {
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.MONTH)
  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle className="flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          {title ?? <Typography variant="h3">{t('totalTransactions.header')}</Typography>}

          <div className="md:ml-4 md:flex-1 md:text-right">
            <DurationPills handleChange={setChartDuration} value={chartDuration} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent style={{ height: chartContainerHeight }}>
        <ErrorBoundary light>
          <TotalTransactionsContent
            scope={'scope' in props ? props.scope : { network: props.network, layer: undefined }}
            chartDuration={chartDuration}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
