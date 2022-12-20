import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { BarChart } from '../../components/charts/BarChart'
import { intlDateFormat } from '../../utils/dateFormatter'
import { useGetConsensusStatsDailyVolume } from '../../../oasis-indexer/api'

export function TransactionsStats() {
  const dailyVolumeQuery = useGetConsensusStatsDailyVolume() // use Emerald stats when endpoint is ready

  return (
    <Card>
      <CardHeader disableTypography component="h3" title="Transactions Per Day" />
      <CardContent>
        {dailyVolumeQuery.data?.data.volumes && (
          <BarChart
            data={dailyVolumeQuery.data?.data.volumes}
            dataKey="tx_volume"
            formatters={{
              data: (value: number) => `${value} tx/day`,
              label: (value: string) => intlDateFormat(new Date(value)),
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
