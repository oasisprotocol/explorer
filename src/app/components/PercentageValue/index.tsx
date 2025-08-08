import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type PercentageValueProps = {
  adaptMaximumFractionDigits?: boolean
  total?: number
  value: number | undefined
  maximumFractionDigits?: number
}

export const PercentageValue: FC<PercentageValueProps> = ({
  maximumFractionDigits,
  adaptMaximumFractionDigits = 2,
  value,
  total = 100,
}) => {
  const { t } = useTranslation()

  if (typeof value !== 'number' || typeof total !== 'number' || total <= 0) {
    return null
  }

  const percentageValue = value / total

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
