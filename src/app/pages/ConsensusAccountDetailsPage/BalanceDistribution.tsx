import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { Account } from '../../../oasis-nexus/api'
import { PieChart } from '../../components/charts/PieChart'
import { useScreenSize } from '../../hooks/useScreensize'
import { getPreciseNumberFormat } from 'locales/getPreciseNumberFormat'
import { COLORS } from '../../../styles/theme/colors'

type BalanceDistributionProps = {
  account: Account | undefined
  isLoading: boolean
}

export const BalanceDistribution: FC<BalanceDistributionProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('account.balanceDistribution')} />
      <CardContent>
        {isLoading && <Skeleton variant="rectangular" height={300} />}
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
  const totalValue = t('common.valueInToken', {
    ...getPreciseNumberFormat(account.total),
    ticker: account.ticker,
  })
  const data = [
    {
      label: t('account.available'),
      value: Number(account.available),
    },
    {
      label: t('account.staking'),
      value: Number(account.delegations_balance),
    },
    {
      label: t('account.debonding'),
      value: Number(account.debonding_delegations_balance),
    },
  ]

  return (
    <>
      {!isMobile && (
        <Typography sx={{ fontSize: '24px', fontWeight: 700, color: COLORS.brandDark, mb: 3 }}>
          {t('account.totalValue', {
            value: totalValue,
          })}
        </Typography>
      )}
      <Box sx={{ height: '250px' }}>
        <PieChart
          compact={false}
          data={data}
          dataKey="value"
          formatters={{
            data: (value: number) =>
              t('common.valueInToken', {
                ...getPreciseNumberFormat(value.toString()),
                ticker: account.ticker,
              }),
            label: (label: string) => label,
          }}
        />
      </Box>
    </>
  )
}
