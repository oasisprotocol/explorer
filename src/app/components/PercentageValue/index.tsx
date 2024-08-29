import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type PercentageValueProps = {
  total: number | undefined
  value: number | undefined
}

export const PercentageValue: FC<PercentageValueProps> = ({ value, total }) => {
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
            maximumFractionDigits: 2,
          } satisfies Intl.NumberFormatOptions,
        },
      })}
    </>
  )
}
