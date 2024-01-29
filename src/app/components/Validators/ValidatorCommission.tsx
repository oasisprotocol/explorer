import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type ValidatorCommissionProps = {
  commission: number
}

export const ValidatorCommission: FC<ValidatorCommissionProps> = ({ commission }) => {
  const { t } = useTranslation()

  return (
    <>
      {t('common.valuePair', {
        value: commission / 100000,
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
