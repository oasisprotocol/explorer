import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { BarChart } from '../../components/charts/BarChart'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'

export function TransactionsStats() {
  const { t } = useTranslation()
  const dailyVolumeQuery = useGetLayerStatsTxVolume(Layer.emerald, {
    // TODO: Do we want some parameters for the stats? Like these:
    // limit: 2,
    // offset: 2,
    // bucket_size_seconds: 60,
  })

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('transactionStats.header')} />
      <CardContent>
        {dailyVolumeQuery.data?.data.buckets && (
          <BarChart
            data={dailyVolumeQuery.data?.data.buckets}
            dataKey="tx_volume"
            formatters={{
              data: (value: number) => t('transactionStats.tooltip', { value }),
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
