import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type FiatValueProps = {
  isLoading: boolean
  value: number | undefined
}

export const FiatValue: FC<FiatValueProps> = ({ isLoading, value }) => {
  const { t } = useTranslation()

  return (
    <>
      {!isLoading && value
        ? t('common.fiatValueInUSD', {
            value: value,
            formatParams: {
              value: {
                currency: 'USD',
              } satisfies Intl.NumberFormatOptions,
            },
          })
        : t('common.missing')}
    </>
  )
}
