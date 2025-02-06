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
import { ConsensusAccountCardEmptyState } from './ConsensusAccountCardEmptyState'

type BalanceDistributionProps = {
  account: Account | undefined
  isLoading: boolean
}

export const BalanceDistribution: FC<BalanceDistributionProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        disableTypography
        component="h3"
        title={t('account.balanceDistribution')}
        sx={{ paddingBottom: 0 }}
      />
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
      <Typography
        sx={{
          fontSize: isMobile ? '14px' : '18px',
          fontWeight: isMobile ? 500 : 700,
          color: COLORS.brandDark,
          mb: 4,
        }}
      >
        {t('account.totalValue', {
          value: totalValue,
        })}
      </Typography>
      <Box sx={{ height: isMobile ? '100px' : '250px' }}>
        <PieChart
          compact={isMobile}
          data={data}
          dataKey="value"
          formatters={{
            data: (value, payload) =>
              t('common.valueInToken', {
                ...getPreciseNumberFormat(String(payload!.preciseValue)),
                ticker: account.ticker,
              }),
            label: (label: string) => label,
          }}
        />
      </Box>
    </>
  )
}
