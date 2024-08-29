import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type PercentageValueProps = {
  adaptMaximumFractionDigits?: boolean
  total: number | undefined
  value: number | undefined
}

export const PercentageValue: FC<PercentageValueProps> = ({ adaptMaximumFractionDigits, value, total }) => {
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
            maximumFractionDigits: adaptMaximumFractionDigits && percentageValue < 0.001 ? 3 : 2,
          } satisfies Intl.NumberFormatOptions,
        },
      })}
    </>
  )
}
