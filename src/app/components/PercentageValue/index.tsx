import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'

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

  if (value === undefined || value === null || total === undefined || total === null) {
    return null
  }

  const votes = new BigNumber(value)
  const totalVotes = new BigNumber(total)

  if (!votes || !totalVotes || totalVotes.lte(0)) {
    return null
  }

  const percentageValue = votes.div(totalVotes).toNumber()

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
