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
  const truncatedNumber = number.decimalPlaces(numberOfDecimals, BigNumber.ROUND_DOWN)

  return (
    <>
      {!number.isZero() && truncatedNumber.isZero()
        ? t('common.lessThanAmount', { value: truncatedNumber.toFixed(numberOfDecimals), ticker })
        : `${truncatedNumber.toFixed()} ${ticker}`}
    </>
  )
}

export const RoundedRoseBalance: FC<RoundedBalanceProps> = ({ value }) => {
  const { t } = useTranslation()

  return <RoundedBalance ticker={t('common.rose')} value={value} />
}
