import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'

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

  if (number.isEqualTo(truncatedNumber)) {
    return <span>{`${number.toFixed()} ${ticker}`}</span>
  }

  return (
    <span>
      {!number.isZero() && truncatedNumber.isZero() ? (
        t('common.lessThanAmount', { value: truncatedNumber.toFixed(numberOfDecimals), ticker })
      ) : (
        <Tooltip
          arrow
          placement="top"
          title={`${number.toFixed()} ${ticker}`}
          enterDelay={tooltipDelay}
          enterNextDelay={tooltipDelay}
        >
          <span>
            {truncatedNumber.toFixed()}… {ticker}
          </span>
        </Tooltip>
      )}
    </span>
  )
}

export const RoundedRoseBalance: FC<RoundedBalanceProps> = ({ value }) => {
  const { t } = useTranslation()

  return <RoundedBalance ticker={t('common.rose')} value={value} />
}
