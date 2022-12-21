import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { BarChart } from '../../components/charts/BarChart'
import { intlDateFormat } from '../../utils/dateFormatter'
import { useGetConsensusStatsDailyVolume } from '../../../oasis-indexer/api'

export function TransactionsStats() {
  const { t } = useTranslation()
  const dailyVolumeQuery = useGetConsensusStatsDailyVolume() // use Emerald stats when endpoint is ready

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('transactionStats.header')} />
      <CardContent>
        {dailyVolumeQuery.data?.data.volumes && (
          <BarChart
            data={dailyVolumeQuery.data?.data.volumes}
            dataKey="tx_volume"
            formatters={{
              data: (value: number) => t('transactionStats.tooltip', { value }),
              label: (value: string) => intlDateFormat(new Date(value)),
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
