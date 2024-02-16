import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { NativeTicker, Ticker } from '../types/ticker'
import { getTickerForScope } from '../config'
import { RouteUtils } from '../app/utils/route-utils'
import { exhaustedTypeWarning } from '../types/errors'

type GetRosePriceParams = {
  ids: string
  vs_currencies: string
  include_market_cap?: string
  include_24hr_vol?: string
  include_24hr_change?: string
  include_last_updated_at?: string
  precision?: string
}

type GetRosePriceResponse = {
  'oasis-network': {
    usd: number
  }
}

export const getRosePrice = (params: GetRosePriceParams): Promise<AxiosResponse<GetRosePriceResponse>> => {
  return axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: { ...params },
  })
}

const staleTime = 1000 * 60 * 3 // 3 minutes

export function useGetRosePrice() {
  return useQuery<Awaited<ReturnType<typeof getRosePrice>>, AxiosError<unknown>, number>(
    ['roseFiatPrice'],
    () =>
      getRosePrice({
        ids: 'oasis-network',
        vs_currencies: 'usd',
      }),
    {
      select: ({ data }) => data['oasis-network'].usd,
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

export const useTokenPrice = (ticker: NativeTicker): TokenPriceInfo => {
  const { isLoading: roseIsLoading, data: rosePrice } = useGetRosePrice()
  switch (ticker) {
    case Ticker.ROSE:
      return {
        price: rosePrice,
        isLoading: roseIsLoading,
        isFree: false,
        hasUsedCoinGecko: true,
      }
    case Ticker.TEST:
      return {
        hasUsedCoinGecko: false,
        isLoading: false,
        isFree: true,
      }
    default:
      exhaustedTypeWarning('Checking price of unknown token', ticker)
      return {
        isLoading: false,
        hasUsedCoinGecko: false,
        isFree: false,
      }
  }
}

export type AllTokenPrices = Record<NativeTicker, TokenPriceInfo>

export const useAllTokenPrices = (): AllTokenPrices => {
  const results = {} as any
  RouteUtils.getEnabledScopes().forEach(scope => {
    const ticker = getTickerForScope(scope)
    // The list of networks will never change on the run, so we can do this
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[ticker] = useTokenPrice(ticker)
  })
  return results
}
