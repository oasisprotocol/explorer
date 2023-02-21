import { useTranslation } from 'react-i18next'
import { Layer, useGetLayerStatsTxVolume } from '../../../oasis-indexer/api'
import { ChartDuration, durationToQueryParams } from '../../utils/chart-utils'
import { LineChart } from '../../components/charts/LineChart'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { intlDateFormat } from '../../utils/dateFormatter'
import { FC, memo } from 'react'
import { SnapshotCard } from './SnapshotCard'
import { PercentageGain } from '../../components/PercentageGain'

interface TransactionsChartCardProps {
  chartDuration: ChartDuration
}

const TransactionsChartCardCmp: FC<TransactionsChartCardProps> = ({ chartDuration }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const statsParams = durationToQueryParams[chartDuration]
  const { data } = useGetLayerStatsTxVolume(Layer.emerald, statsParams)

  const lineChartData = data?.data.buckets.map(bucket => {
    return {
      bucket_start: bucket.bucket_start,
      volume_per_second: bucket.tx_volume / statsParams.bucket_size_seconds,
    }
  })

  const totalTransactions = data?.data.buckets.reduce((acc, curr) => acc + curr.tx_volume, 0) ?? 0

  return (
    <SnapshotCard
      title={t('common.transactions')}
      // TODO: show real percentage value
      badge={<PercentageGain percentage={23} />}
      label={totalTransactions.toString()}
    >
      {lineChartData && (
        <LineChart
          dataKey="volume_per_second"
          data={lineChartData.slice().reverse()}
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
