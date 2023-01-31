import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { useGetConsensusStatsTxVolume } from '../../../oasis-indexer/api'

export const AverageTransactionSize: FC = () => {
  const { t } = useTranslation()
  // TODO: Replace with real stats when available
  const dailyVolumeQuery = useGetConsensusStatsTxVolume()

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('averageTransactionSize.header')} />
      <CardContent>
        {dailyVolumeQuery.data?.data.buckets && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid={true}
            strokeWidth={3}
            dataKey="volume"
            data={dailyVolumeQuery.data?.data.buckets}
            margin={{ left: 16, right: 0, top: 16, bottom: 16 }}
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
                    },
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
