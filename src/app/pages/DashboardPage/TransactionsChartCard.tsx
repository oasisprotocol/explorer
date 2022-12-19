import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { getConsensusStatsTps } from '../../../oasis-indexer/generated/api'
import { useCallback, useState } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { ChartUtils } from '../../utils/chart-utils'
import { CardActions } from '@mui/material'
import { LineChart, LineChartDataPoint } from '../../components/charts/LineChart'
import { DateTimeUtils } from '../../utils/date-time-utils'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export function TransactionsChartCard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [lineChartData, setLineChartData] = useState<LineChartDataPoint[] | null>(null)
  const [totalTransactions, setTotalTransactions] = useState<number | null>(null)

  const init = useCallback(async () => {
    // TODO: Replace with Emerald stats
    const { data } = await getConsensusStatsTps({
      // TODO: Can interval_minutes be configured?
      limit: ChartUtils.getLimitByDuration(),
    })

    const dataPoints = data.tps_checkpoints?.map(({ tx_volume, timestamp }) => ({
      label: DateTimeUtils.format(new Date(timestamp!)),
      value: tx_volume ?? 0,
    }))

    const totalTransactionSum = data.tps_checkpoints?.reduce((acc, curr) => {
      return acc + (curr?.tx_volume ?? 0)
    }, 0)

    setLineChartData(dataPoints ?? null)
    setTotalTransactions(totalTransactionSum ?? 0)
  }, [])

  useEffectOnce(() => {
    init()
  })

  return (
    <Card sx={{ p: 0 }}>
      <CardHeader component='h5' title='Transactions' />
      <CardContent>
        {lineChartData !== null &&
          <LineChart data={lineChartData} margin={{ left: 0, right: isMobile ? 80 : 40 }}></LineChart>}
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>+23%</span>
          <span>{totalTransactions}</span>
        </Box>
      </CardActions>
    </Card>
  )
}
