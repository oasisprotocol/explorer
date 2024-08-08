import axios from 'axios'
import type { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Ticker } from '../types/ticker'
import { getTokensForScope } from '../config'
import { RouteUtils } from '../app/utils/route-utils'
import { uniq } from '../app/utils/helpers'
import { exhaustedTypeWarning } from '../types/errors'

type GetTokenPricesFromGeckoParams = {
  ids: string
  vs_currencies: string
  include_market_cap?: string
  include_24hr_vol?: string
  include_24hr_change?: string
  include_last_updated_at?: string
  precision?: string
}

type TokenPriceMap = { [tokenId in string]?: number }

type GetTokenPricesFromGeckoResponse = { [tokenId in string]?: { [fiatCurrency in string]: number } }

const staleTime = 1000 * 60 * 3 // 3 minutes

export function useGetTokenPricesFromGecko(tokenIds: string[], fiatCurrency: string) {
  return useQuery<TokenPriceMap, AxiosError<unknown>>(
    ['tokenFiatPrices', tokenIds, fiatCurrency],
    () =>
      axios
        .get<GetTokenPricesFromGeckoResponse>('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: tokenIds.join(','),
            vs_currencies: fiatCurrency ?? 'usd',
          } satisfies GetTokenPricesFromGeckoParams,
        })
        .then(({ data }) => {
          const result: TokenPriceMap = {}
          Object.keys(data).forEach(key => {
            result[key] = data[key]![fiatCurrency]
          })
          return result
        }),
    {
      staleTime,
      useErrorBoundary: false,
    },
  )
}

export type TokenPriceInfo = {
  price?: number
  fiatCurrency?: string
  isLoading: boolean
  isFree: boolean
  hasUsedCoinGecko: boolean
}

export const useTokenPrice = (ticker: Ticker, fiatCurrency: string): TokenPriceInfo => {
  const tokenPrices = useAllTokenPrices(fiatCurrency)
  const price = tokenPrices[ticker]
  if (!price) {
    exhaustedTypeWarning('Checking price of unknown token ticker', ticker as any)
  }
  return price || tokenPrices[Ticker.TEST]!
}

export type AllTokenPrices = Partial<Record<Ticker, TokenPriceInfo>>

export const useAllTokenPrices = (fiatCurrency: string): AllTokenPrices => {
  const tokens = uniq(RouteUtils.getEnabledScopes().map(getTokensForScope).flat())
  const geckoIds = tokens.map(token => token.geckoId).filter((id): id is string => !!id)
  const { isLoading: geckoIsLoading, data: geckoPrices } = useGetTokenPricesFromGecko(geckoIds, fiatCurrency)
  const results: AllTokenPrices = {}
  tokens.forEach(token => {
    results[token.ticker] = {
      isLoading: geckoIsLoading,
      isFree: !!token.free,
      hasUsedCoinGecko: !!token.geckoId,
      price: token.geckoId && geckoPrices ? geckoPrices[token.geckoId] : undefined,
      fiatCurrency: token.geckoId && geckoPrices ? fiatCurrency : 'xx',
    }
  })
  return results
}
