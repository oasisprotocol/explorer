import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { RoundedBalance } from '../RoundedBalance'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type BalancesDiffProps = {
  before: string | undefined
  after: string | undefined
  ticker: string
}

export const BalancesDiff: FC<BalancesDiffProps> = ({ before, after, ticker }) => {
  const { t } = useTranslation()

  if (!before || !after) {
    return t('common.missing')
  }

  const result = new BigNumber(after).minus(new BigNumber(before))
  const isNegative = result.isNegative()

  return (
    <Typography className={cn(isNegative ? 'text-destructive' : 'text-success')}>
      <RoundedBalance compactAllNumbers showSign value={result.toFixed()} ticker={ticker} />
    </Typography>
  )
}
