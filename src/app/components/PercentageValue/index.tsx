import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { calculatePercentage } from '../../utils/number-utils'

type PercentageValueProps = {
  value: number | string | undefined
  total?: number | string
  fractionDigits?: number
  adaptive?: boolean
}

export const PercentageValue: FC<PercentageValueProps> = ({
  value,
  total = 100,
  fractionDigits = 2,
  adaptive = false,
}) => {
  const { t } = useTranslation()

  const percentageValue = calculatePercentage(value, total, false)

  if (percentageValue === null) {
    return null
  }

  const maximumFractionDigits = adaptive && percentageValue < 0.001 ? 3 : fractionDigits

  return (
    <>
      {t('common.valuePair', {
        value: percentageValue,
        formatParams: {
          value: {
            style: 'percent',
            maximumFractionDigits,
          } satisfies Intl.NumberFormatOptions,
        },
      })}
    </>
  )
}
