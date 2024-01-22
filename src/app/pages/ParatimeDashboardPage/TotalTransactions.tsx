import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { useGetLayerStatsTxVolume } from '../../../oasis-nexus/api'
import { chartUseQueryStaleTimeMs, durationToQueryParams } from '../../utils/chart-utils'
import { DurationPills } from '../../components/DurationPills'
import { CardHeaderWithResponsiveActions } from '..//../components/CardHeaderWithResponsiveActions'
import { ChartDuration, cumulativeSum } from '../../utils/chart-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchScope } from '../../../types/searchScope'

export const TotalTransactions: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.MONTH)
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
    <Card>
      <CardHeaderWithResponsiveActions
        action={<DurationPills handleChange={setChartDuration} value={chartDuration} />}
        disableTypography
        component="h3"
        title={t('totalTransactions.header')}
      />
      <CardContent sx={{ height: 450 }}>
        {windows && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey="tx_volume"
            data={windows}
            margin={{ bottom: 16, top: isMobile ? 0 : 16 }}
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
