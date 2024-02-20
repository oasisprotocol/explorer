import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
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

type TokenPriceMap = Partial<Record<string, number>>

type GetTokenPricesFromGeckoResponse = TokenPriceMap

export const getTokenPricesFromGecko = (
  params: GetTokenPricesFromGeckoParams,
): Promise<AxiosResponse<GetTokenPricesFromGeckoResponse>> => {
  return axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: { ...params },
  })
}

const staleTime = 1000 * 60 * 3 // 3 minutes

export function useGetTokenPricesFromGecko(tokenIds: string[]) {
  return useQuery<AxiosResponse<TokenPriceMap>, AxiosError<unknown>>(
    ['tokenFiatPrices'],
    () =>
      getTokenPricesFromGecko({
        ids: tokenIds.join(','),
        vs_currencies: 'usd',
      }),
    {
      select: ({ data }) => {
        const result: TokenPriceMap = {}
        Object.keys(data).forEach(key => (result[key] = (data as any)[key].usd)) // TODO why are we fixated on USD
        return result as any
      },
      staleTime,
    },
  )
}

export type TokenPriceInfo = {
  price?: number
  isLoading: boolean
  isFree: boolean
  hasUsedCoinGecko: boolean
}

export const useTokenPrice = (ticker: Ticker): TokenPriceInfo => {
  const tokenPrices = useAllTokenPrices()
  const price = tokenPrices[ticker]
  if (!price) {
    exhaustedTypeWarning('Checking price of unknown token ticker', ticker as any)
  }
  return price || tokenPrices[Ticker.TEST]!
}

export type AllTokenPrices = Partial<Record<Ticker, TokenPriceInfo>>

export const useAllTokenPrices = (): AllTokenPrices => {
  const tokens = uniq(RouteUtils.getEnabledScopes().map(getTokensForScope).flat())
  const geckoIds = tokens.map(token => token.geckoId).filter((id): id is string => !!id)
  const { isLoading: geckoIsLoading, data: geckoPrices } = useGetTokenPricesFromGecko(geckoIds)
  const results: AllTokenPrices = {}
  tokens.forEach(token => {
    results[token.ticker] = {
      isLoading: geckoIsLoading,
      isFree: !!token.free,
      hasUsedCoinGecko: !!token.geckoId,
      price: token.geckoId && geckoPrices ? (geckoPrices as any)[token.geckoId] : undefined,
    }
  })
  return results
}
