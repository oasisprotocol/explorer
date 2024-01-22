import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { BarChart } from '../../components/charts/BarChart'
import { useGetLayerStatsTxVolume } from '../../../oasis-nexus/api'
import {
  chartUseQueryStaleTimeMs,
  durationToQueryParams,
  getMonthlyWindowsDailyAverage,
} from '../../utils/chart-utils'
import { DurationPills } from '../../components/DurationPills'
import { CardHeaderWithResponsiveActions } from '../../components/CardHeaderWithResponsiveActions'
import { ChartDuration } from '../../utils/chart-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchScope } from '../../../types/searchScope'

export const TransactionsStats: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.MONTH)
  const statsParams = durationToQueryParams[chartDuration]

  const dailyVolumeQuery = useGetLayerStatsTxVolume(scope.network, scope.layer, statsParams, {
    query: {
      keepPreviousData: true,
      staleTime: chartUseQueryStaleTimeMs,
    },
  })
  const allTime = dailyVolumeQuery.isFetched && chartDuration === ChartDuration.YEAR
  const windows = allTime
    ? getMonthlyWindowsDailyAverage(dailyVolumeQuery.data?.data.windows)
    : dailyVolumeQuery.data?.data.windows
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
        {windows && (
          <BarChart
            barSize={chartDuration === ChartDuration.WEEK ? 125 : undefined}
            barRadius={chartDuration === ChartDuration.WEEK ? 20 : undefined}
            cartesianGrid
            data={windows.slice().reverse()}
            dataKey="tx_volume"
            formatters={{
              data: (value: number) => t('transactionStats.perDay', { value: value.toLocaleString() }),
              label: (value: string) =>
                t('common.formattedDateTime', {
                  timestamp: new Date(value),
                  formatParams,
                }),
            }}
            withLabels
            margin={{ bottom: 16, top: isMobile ? 0 : 16 }}
          />
        )}
      </CardContent>
    </Card>
  )
}
