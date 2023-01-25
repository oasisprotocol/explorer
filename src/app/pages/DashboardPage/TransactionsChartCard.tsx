import { useTranslation } from 'react-i18next'
import { useGetConsensusStatsTxVolume } from '../../../oasis-indexer/api'
import { ChartDuration, durationToQueryParams } from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { intlDateFormat } from '../../utils/dateFormatter'
import { FC, memo } from 'react'
import { SnapshotCard } from './SnapshotCard'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const statsParams = durationToQueryParams[chartDuration]
  // TODO: Replace with Emerald stats
  const { data } = useGetConsensusStatsTxVolume(statsParams)

  const lineChartData = data?.data.buckets.map(bucket => {
    return {
      bucket_start: bucket.start,
      volume_per_second: bucket.volume / statsParams.bucket_size_seconds,
    }
  })

  const totalTransactions = data?.data.buckets.reduce((acc, curr) => acc + curr.volume, 0) ?? 0

  return (
    <SnapshotCard title={t('common.transactions')} percentage={23} label={totalTransactions.toString()}>
      {lineChartData && (
        <LineChart
          dataKey="volume_per_second"
          data={lineChartData}
          margin={{ left: 0, right: isMobile ? 80 : 40 }}
          formatters={{
            data: (value: number) => t('transactionsTpsChart.tooltip', { value }),
            label: (value: string) => intlDateFormat(new Date(value)),
          }}
        />
      )}
    </SnapshotCard>
  )
}

export const TransactionsChartCard = memo(TransactionsChartCardCmp)
