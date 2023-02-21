import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'

export const AverageTransactionSize: FC = () => {
  const { t } = useTranslation()
  const dailyVolumeQuery = useGetLayerStatsTxVolume(
    Layer.consensus, // TODO: switch to Emerald when it becomes available
  )

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('averageTransactionSize.header')} />
      <CardContent>
        {dailyVolumeQuery.data?.data.buckets && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid={true}
            strokeWidth={3}
            dataKey="tx_volume"
            data={dailyVolumeQuery.data?.data.buckets.slice().reverse()}
            margin={{ left: 16, right: 0 }}
            tickMargin={16}
            withLabels={true}
            formatters={{
              data: (value: number) =>
                t('averageTransactionSize.tooltip', {
                  value,
                  formatParams: {
                    value: {
                      style: 'unit',
                      unit: 'byte',
                      unitDisplay: 'long',
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
