import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'

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
