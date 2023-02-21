import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'

type RoundedRoseValueProps = {
  value?: string
}

const numberOfDecimals = 8

export const RoundedRoseValue: FC<RoundedRoseValueProps> = ({ value }) => {
  const { t } = useTranslation()

  if (!value) {
    return null
  }

  const number = new BigNumber(value)
  const roundedNumber = number.decimalPlaces(numberOfDecimals, BigNumber.ROUND_HALF_CEIL)

  return (
    <>
      {!number.isZero() && roundedNumber.isZero()
        ? t('common.lessThanRoseAmount', { value: roundedNumber.toFixed(numberOfDecimals) })
        : t('common.valueInRose', { value: roundedNumber.toFixed() })}
    </>
  )
}
