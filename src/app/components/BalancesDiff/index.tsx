import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { RoundedBalance } from '../RoundedBalance'

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
    <Typography
      sx={{
        color: isNegative ? COLORS.error : COLORS.eucalyptus,
      }}
    >
      <RoundedBalance compactAllNumbers showSign value={result.toFixed()} ticker={ticker} />
    </Typography>
  )
}
