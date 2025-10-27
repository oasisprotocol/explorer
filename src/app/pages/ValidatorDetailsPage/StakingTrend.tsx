import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { useGetConsensusValidatorsAddressHistory } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { LineChart } from '../../components/charts/LineChart'
import { useScreenSize } from '../../hooks/useScreensize'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

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
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('validator.stakingTrend')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        {history && filteredHistory && (
          <LineChart
            alignDomainToDataPoints
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey="active_balance"
            data={filteredHistory}
            margin={{ bottom: 16, top: isMobile ? 0 : 16 }}
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
