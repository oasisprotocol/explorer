import { RuntimeSdkBalance } from '../../../oasis-nexus/api'
import { AllTokenPrices } from '../../../coin-gecko/api'
import BigNumber from 'bignumber.js'
import { Ticker } from '../../../types/ticker'

export const hasRuntimeBalance = (balances: RuntimeSdkBalance[] = []) =>
  balances.some(balance => balance.token_decimals)

export type FiatValueInfo = {
  /**
   * Do we have any known real value?
   */
  hasValue: boolean

  /**
   * The fiat value, to the best of our information
   */
  value?: string

  /**
   * The fiat currency used to express the value
   */
  fiatCurrency: string

  /**
   * Have we used CoinGecko for calculating this value?
   */
  hasUsedCoinGecko: boolean

  /**
   * Is the value of one of the tokens still being loaded?
   */
  loading: boolean

  /**
   * Any tokens for which we don't know the value?
   */
  unknownTickers: Ticker[]
}

export const calculateFiatValue = (
  balances: RuntimeSdkBalance[] = [],
  tokenPrices: AllTokenPrices,
  fiatCurrency: string,
): FiatValueInfo => {
  let hasValue = false
  let value = new BigNumber(0)
  let hasUsedCoinGecko = false
  let loading = false
  const unknown: Ticker[] = []

  balances.forEach(balance => {
    const priceInfo = tokenPrices[balance.token_symbol as Ticker]
    if (priceInfo) {
      if (priceInfo.isLoading) {
        loading = true
      } else {
        hasUsedCoinGecko = hasUsedCoinGecko || priceInfo.hasUsedCoinGecko
        if (!priceInfo.isFree) {
          const tokenFiatValue = priceInfo.price
          hasValue = true
          if (tokenFiatValue === undefined) {
            unknown.push(balance.token_symbol as Ticker)
          } else {
            value = value.plus(new BigNumber(balance.balance).multipliedBy(tokenFiatValue))
          }
        }
      }
    } else {
      unknown.push(balance.token_symbol as Ticker)
      hasValue = true
    }
  })

  return {
    hasValue,
    hasUsedCoinGecko,
    loading,
    unknownTickers: unknown,
    value: value.toFixed(),
    fiatCurrency,
  }
}
