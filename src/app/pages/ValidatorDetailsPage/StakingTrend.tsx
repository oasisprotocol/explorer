import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useGetConsensusValidatorsAddressHistory } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { LineChart } from '../../components/charts/LineChart'
import { useScreenSize } from '../../hooks/useScreensize'

const epochsInMonth = 720

type StakingTrendProps = {
  address: string
  scope: SearchScope
}

export const StakingTrend: FC<StakingTrendProps> = ({ address, scope }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const historyQuery = useGetConsensusValidatorsAddressHistory(scope.network, address, {
    limit: epochsInMonth,
  })
  const history = historyQuery.data?.data?.history
  const filteredHistory = history
    ?.map(item => ({
      active_balance: Number(item.active_balance), // Doesn't need to be very precise
      epoch: item.epoch,
    }))
    .reverse()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader disableTypography component="h3" title={t('validator.stakingTrend')} />
      <CardContent sx={{ height: 250 }}>
        {history && filteredHistory && (
          <LineChart
            alignDomainToDataPoints
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey="active_balance"
            data={filteredHistory}
            margin={{ bottom: 16, top: isMobile ? 0 : 16 }}
            tickMargin={16}
            withLabels
            maximumFractionDigits={2}
            formatters={{
              data: value =>
                t('common.valueInToken', {
                  value,
                  ticker: history[0].ticker,
                  formatParams: {
                    value: {
                      maximumFractionDigits: 0,
                    } satisfies Intl.NumberFormatOptions,
                  },
                }),
              label: (value: string) => `${t('common.epoch')}: ${value}`,
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
