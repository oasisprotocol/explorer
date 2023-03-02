import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'

type RoundedBalanceProps = {
  ticker?: string
  value?: string
}

const numberOfDecimals = 5

export const RoundedBalance: FC<RoundedBalanceProps> = ({ ticker, value }) => {
  const { t } = useTranslation()

  if (!value) {
    return null
  }

  const number = new BigNumber(value)
  const roundedNumber = number.decimalPlaces(numberOfDecimals, BigNumber.ROUND_HALF_CEIL)

  return (
    <>
      {!number.isZero() && roundedNumber.isZero()
        ? t('common.lessThanAmount', { value: roundedNumber.toFixed(numberOfDecimals), ticker })
        : `${roundedNumber.toFixed()} ${ticker}`}
    </>
  )
}

export const RoundedRoseBalance: FC<RoundedBalanceProps> = ({ value }) => {
  const { t } = useTranslation()

  return <RoundedBalance ticker={t('common.rose')} value={value} />
}
