import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { getNameForTicker } from '../../../types/ticker'
import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from '../Tokens/TokenLink'
import { PlaceholderLabel } from '../../utils/PlaceholderLabel'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

type RoundedBalanceProps = {
  ticker?: string
  value?: string
  scope?: SearchScope
  tokenAddress?: string
  tickerAsLink?: boolean | undefined
  compactLargeNumbers?: boolean
}

const numberOfDecimals = 5

export const RoundedBalance: FC<RoundedBalanceProps> = ({
  ticker,
  value,
  scope,
  tokenAddress,
  tickerAsLink,
  compactLargeNumbers,
}) => {
  const { t } = useTranslation()

  if (!value) {
    return null
  }

  const number = new BigNumber(value)
  const truncatedNumber = number.decimalPlaces(numberOfDecimals, BigNumber.ROUND_DOWN)

  const tickerName = ticker ? getNameForTicker(t, ticker) : ''

  const tickerLink =
    tickerAsLink && !!scope && !!tokenAddress ? (
      <TokenLink scope={scope} address={tokenAddress} name={tickerName} />
    ) : (
      <PlaceholderLabel label={tickerName} />
    )

  if (number.isGreaterThan(100_000) && compactLargeNumbers) {
    return (
      <Tooltip
        arrow
        placement="top"
        title={t('common.valueInToken', { ...getPreciseNumberFormat(value), ticker: tickerName })}
        enterDelay={tooltipDelay}
        enterNextDelay={tooltipDelay}
      >
        <span>
          {t('common.valuePair', {
            value: value,
            formatParams: {
              value: {
                notation: 'compact',
              } satisfies Intl.NumberFormatOptions,
            },
          })}
          &nbsp;
          {tickerName}
        </span>
      </Tooltip>
    )
  }

  if (number.isEqualTo(truncatedNumber)) {
    return (
      <Trans
        t={t}
        i18nKey="common.valueInTokenWithLink"
        values={{ ...getPreciseNumberFormat(value) }}
        components={{ TickerLink: tickerLink }}
      />
    )
  }

  const almostZero = !number.isZero() && truncatedNumber.isZero()

  return (
    <span>
      <Tooltip
        arrow
        placement="top"
        title={t('common.valueInToken', { ...getPreciseNumberFormat(value), ticker: tickerName })}
        enterDelay={tooltipDelay}
        enterNextDelay={tooltipDelay}
      >
        <span>
          <Trans
            t={t}
            i18nKey={almostZero ? 'common.lessThanAmount' : 'common.roundedValueInToken'}
            values={{
              value: truncatedNumber.toFixed(numberOfDecimals),
              formatParams: {
                value: {
                  minimumFractionDigits: numberOfDecimals,
                  maximumFractionDigits: numberOfDecimals,
                } satisfies Intl.NumberFormatOptions,
              },
            }}
            shouldUnescape={true}
            components={{ TickerLink: tickerLink }}
          />
        </span>
      </Tooltip>
    </span>
  )
}
