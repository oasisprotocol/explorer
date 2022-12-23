import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { TpsCheckpoint, useGetConsensusStatsTps } from '../../../oasis-indexer/generated/api'
import { ChartDuration, ChartUtils } from '../../utils/chart-utils'
import { CardActions } from '@mui/material'
import { LineChart } from '../../components/charts/LineChart'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { PercentageGain } from '../../components/PercentageGain'
import { intlDateFormat } from '../../utils/dateFormatter'
import { FC, memo } from 'react'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // TODO: Replace with Emerald stats
  const { data } = useGetConsensusStatsTps({
    // TODO: Can interval_minutes be configured? 5 interval on 1 month is too granular
    limit: ChartUtils.getLimitByDuration(chartDuration),
  })

  const lineChartData = data?.data.tps_checkpoints ?? null

  const totalTransactions =
    data?.data.tps_checkpoints?.reduce((acc, curr) => {
      return acc + (curr?.tx_volume ?? 0)
    }, 0) ?? 0

  return (
    <Card sx={{ p: 0 }}>
      <CardHeader component="h5" title={t('transactionsTpsChart.header')} sx={{ pb: 0, pl: 4, pt: 4 }} />
      <CardContent sx={{ pt: 4 }}>
        {lineChartData !== null && (
          <LineChart<TpsCheckpoint>
            dataKey="tx_volume"
            data={lineChartData}
            margin={{ left: 0, right: isMobile ? 80 : 40 }}
            strokeWidth={1.09}
            formatters={{
              data: (value: number) => t('transactionsTpsChart.tooltip', { value }),
              label: (value: string) => intlDateFormat(new Date(value)),
            }}
          />
        )}
      </CardContent>
      <CardActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            px: 3,
            pb: 3,
          }}
        >
          <PercentageGain percentage={23} />
          <Typography variant="h2" sx={{ pr: 4, fontWeight: 'fontWeightRegular' }}>
            {totalTransactions}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  )
}

export const TransactionsChartCard = memo(TransactionsChartCardCmp)
