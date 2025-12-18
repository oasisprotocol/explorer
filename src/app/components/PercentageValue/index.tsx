import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { calculatePercentage } from '../../utils/number-utils'

type PercentageValueProps = {
  adaptMaximumFractionDigits?: boolean
  total?: number | string
  value: number | string | undefined
  maximumFractionDigits?: number
}

export const PercentageValue: FC<PercentageValueProps> = ({
  maximumFractionDigits,
  adaptMaximumFractionDigits = 2,
  value,
  total = 100,
}) => {
  const { t } = useTranslation()

  const percentageValue = calculatePercentage(value, total, false)

  if (percentageValue === null) {
    return null
  }

  return (
    <>
      {t('common.valuePair', {
        value: percentageValue,
        formatParams: {
          value: {
            style: 'percent',
            maximumFractionDigits:
              adaptMaximumFractionDigits && percentageValue < 0.001 ? 3 : maximumFractionDigits,
          } satisfies Intl.NumberFormatOptions,
        },
      })}
    </>
  )
}
