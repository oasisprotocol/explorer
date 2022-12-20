import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { getConsensusStatsTps } from '../../../oasis-indexer/generated/api'
import { useCallback, useState } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { ChartUtils } from '../../utils/chart-utils'
import { CardActions } from '@mui/material'
import LineChart, { LineChartDataPoint } from '../../components/charts/LineChart'
import { DateTimeUtils } from '../../utils/date-time-utils'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import PercentageGain from '../../components/PercentageGain'
import { COLORS } from '../../../styles/theme/colors'

export function TransactionsChartCard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [lineChartData, setLineChartData] = useState<LineChartDataPoint[] | null>(null)
  const [totalTransactions, setTotalTransactions] = useState<number | null>(null)

  const init = useCallback(async () => {
    // TODO: Replace with Emerald stats
    const { data } = await getConsensusStatsTps({
      // TODO: Can interval_minutes be configured? 5 interval on 1 month is too granular
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
      <CardHeader component='h5' title='Transactions' sx={{ pb: 0, pl: 4, pt: 4 }} />
      <CardContent sx={{ pt: 4 }}>
        {lineChartData !== null &&
          <LineChart data={lineChartData} margin={{ left: 0, right: isMobile ? 80 : 40 }} strokeWidth={1.09}></LineChart>}
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: 3, pb: 3 }}>
          <PercentageGain percentage={-23} />
          <Typography variant="h2" sx={{ pr: 4, fontWeight: 'fontWeightRegular', color: COLORS.navyBlueExtraDark }}>
            {totalTransactions}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  )
}
