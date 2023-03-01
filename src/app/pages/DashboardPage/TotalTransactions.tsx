import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LineChart } from '../../components/charts/LineChart'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import { chartUseQueryStaleTimeMs } from '../../utils/chart-utils'
import { DurationPills } from './DurationPills'

export const TotalTransactions: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dailyVolumeQuery = useGetLayerStatsTxVolume(
    Layer.emerald,
    {},
    {
      query: { staleTime: chartUseQueryStaleTimeMs },
    },
  )

  return (
    <Card>
      <CardHeader
        action={!isMobile && <DurationPills />}
        disableTypography
        component="h3"
        title={t('totalTransactions.header')}
      />
      {isMobile && (
        <Box sx={{ mb: 5 }}>
          <DurationPills />
        </Box>
      )}
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
