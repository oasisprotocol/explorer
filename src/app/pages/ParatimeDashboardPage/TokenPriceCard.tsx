import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenPrice } from '../../../coin-gecko/api'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { NativeTokenInfo } from '../../../types/ticker'
import { SmallTokenLogo } from '../../components/logo/SmallTokenLogo'
import { getFiatCurrencyForScope } from '../../../config'
import { useScopeParam } from '../../hooks/useScopeParam'

export const TokenPriceCard: FC<{ token: NativeTokenInfo }> = ({ token }) => {
  const { t } = useTranslation()
  const scope = useScopeParam()
  const fiatCurrency = getFiatCurrencyForScope(scope)
  const priceQuery = useTokenPrice(token.ticker, fiatCurrency)

  const formatFiatParams = {
    value: {
      currency: fiatCurrency,
      maximumFractionDigits: 5,
    } satisfies Intl.NumberFormatOptions,
  }

  const priceString = priceQuery.price
    ? t('common.fiatValueInUSD', {
        value: priceQuery.price,
        formatParams: formatFiatParams,
      })
    : ''

  return (
    <SnapshotCard
      title={
        <div className="flex items-center gap-1.5">
          <SmallTokenLogo ticker={token.ticker} />
          {t('tokenPrice.header', { ticker: token.ticker })}
        </div>
      }
    >
      <>
        <div className="absolute -top-1 left-4">
          <CoinGeckoReferral />
        </div>
        <div className="flex items-center justify-center h-full">
          <Typography className="text-primary text-center text-2xl font-semibold">{priceString}</Typography>
        </div>
      </>
    </SnapshotCard>
  )
}
