import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Account } from '../../../oasis-nexus/api'
import { PieChart } from '../../components/charts/PieChart'
import { useScreenSize } from '../../hooks/useScreensize'
import { ConsensusAccountCardEmptyState } from './ConsensusAccountCardEmptyState'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { RoundedBalance } from '../../components/RoundedBalance'

type BalanceDistributionProps = {
  account: Account | undefined
  isLoading: boolean
}

export const BalanceDistribution: FC<BalanceDistributionProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ height: '100%' }}>
      <Typography variant="h3" className="pb-0">
        {t('account.balanceDistribution')}
      </Typography>
      <CardContent>
        {isLoading && <Skeleton className="h-[300px]" />}
        {account && <BalanceDistributionContent account={account} />}
      </CardContent>
    </Card>
  )
}

type BalanceDistributionContentProps = {
  account: Account
}

const BalanceDistributionContent: FC<BalanceDistributionContentProps> = ({ account }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (account.total === '0') {
    return <ConsensusAccountCardEmptyState label={t('account.noBalances')} />
  }

  // value props have rounding issues. Avoid displaying in text, but they are fine for visualization
  const data = [
    {
      label: t('account.available'),
      preciseValue: account.available,
      value: Number(account.available),
    },
    {
      label: t('common.staked'),
      preciseValue: account.delegations_balance,
      value: Number(account.delegations_balance),
    },
    {
      label: t('account.debonding'),
      preciseValue: account.debonding_delegations_balance,
      value: Number(account.debonding_delegations_balance),
    },
  ]

  return (
    <>
      <Typography variant="small" className="md:text-lg font-medium md:font-bold mb-8 text-primary">
        <RoundedBalance value={account.total} ticker={account.ticker} />
      </Typography>
      <div className="h-[100px] md:h-[250px]">
        <PieChart
          compact={isMobile}
          data={data}
          dataKey="value"
          formatters={{
            data: (value, payload) =>
              t('common.valueInToken', {
                value: payload!.preciseValue,
                formatParams: {
                  value: {
                    notation: 'compact',
                  } satisfies Intl.NumberFormatOptions,
                },
                ticker: account.ticker,
              }),
            label: (label: string) => label,
          }}
        />
      </div>
    </>
  )
}
