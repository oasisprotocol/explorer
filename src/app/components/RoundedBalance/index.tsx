import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from '../Tokens/TokenLink'
import { PlaceholderLabel } from '../../utils/PlaceholderLabel'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

type RoundedBalanceProps = {
  compactAllNumbers?: boolean
  ticker?: string
  value?: string
  scope?: SearchScope
  tokenAddress?: string
  tickerAsLink?: boolean | undefined
  compactLargeNumbers?: boolean
  showSign?: boolean
}

const numberOfDecimals = 5

export const RoundedBalance: FC<RoundedBalanceProps> = ({
  compactAllNumbers,
  compactLargeNumbers,
  scope,
  showSign,
  ticker = '',
  tickerAsLink,
  tokenAddress,
  value,
}) => {
  const { t } = useTranslation()

  if (!value) {
    return null
  }

  const number = new BigNumber(value)
  const truncatedNumber = number.decimalPlaces(numberOfDecimals, BigNumber.ROUND_DOWN)

  const tickerLink =
    tickerAsLink && !!scope && !!tokenAddress ? (
      <TokenLink scope={scope} address={tokenAddress} name={ticker} />
    ) : (
      <PlaceholderLabel label={ticker} />
    )

  const preciseValueFormat = { ...getPreciseNumberFormat(value), ticker: ticker }
  if (showSign) preciseValueFormat.formatParams!.value.signDisplay = 'always'

  if (compactAllNumbers || (number.isGreaterThan(100_000) && compactLargeNumbers)) {
    return (
      <Tooltip
        arrow
        placement="top"
        title={t('common.valueInToken', preciseValueFormat)}
        enterDelay={tooltipDelay}
        enterNextDelay={tooltipDelay}
      >
        <span>
          <Trans
            t={t}
            i18nKey="common.valueInTokenWithLink"
            values={{
              value: value,
              ticker: ticker,
              formatParams: {
                value: {
                  notation: 'compact',
                  signDisplay: showSign ? 'always' : 'auto',
                } satisfies Intl.NumberFormatOptions,
              },
            }}
            components={{ TickerLink: tickerLink }}
          />
        </span>
      </Tooltip>
    )
  }

  if (number.isEqualTo(truncatedNumber)) {
    return (
      <Trans
        t={t}
        i18nKey="common.valueInTokenWithLink"
        values={preciseValueFormat}
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
        title={t('common.valueInToken', preciseValueFormat)}
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
                  signDisplay: showSign ? 'always' : 'auto',
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
