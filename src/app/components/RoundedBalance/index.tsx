import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { getNameForTicker } from '../../../types/ticker'

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

  const tickerName = ticker ? getNameForTicker(t, ticker) : ''

  if (number.isEqualTo(truncatedNumber)) {
    return <span>{t('common.valueInToken', { value: number.toFixed(), ticker: tickerName })}</span>
  }

  return (
    <span>
      <Tooltip
        arrow
        placement="top"
        title={t('common.valueInToken', { value: number.toFixed(), ticker: tickerName })}
        enterDelay={tooltipDelay}
        enterNextDelay={tooltipDelay}
      >
        <span>
          {!number.isZero() && truncatedNumber.isZero()
            ? t('common.lessThanAmount', {
                value: truncatedNumber.toFixed(numberOfDecimals),
                ticker: tickerName,
              })
            : t('common.roundedValueInToken', { value: truncatedNumber.toFixed(), ticker: tickerName })}
        </span>
      </Tooltip>
    </span>
  )
}
