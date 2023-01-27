import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { ChartDuration, chartDurationToDaysMap } from '../app/utils/chart-utils'

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

type GetRoseMarketChartParams = {
  days: number
  vs_currency: string
  interval: undefined | 'daily'
}

type GetRoseMarketChartProp = [number, number][]

type GetRoseMarketChartResponse = {
  market_caps: GetRoseMarketChartProp
  prices: GetRoseMarketChartProp
  total_volumes: GetRoseMarketChartProp
}

export const getGetRoseMarketChart = (
  params: GetRoseMarketChartParams,
): Promise<AxiosResponse<GetRoseMarketChartResponse>> => {
  return axios.get('https://api.coingecko.com/api/v3/coins/oasis-network/market_chart', {
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

export function useGetRoseMarketChart(params: Pick<GetRoseMarketChartParams, 'days'>) {
  return useQuery<
    Awaited<ReturnType<typeof getGetRoseMarketChart>>,
    AxiosError<unknown>,
    GetRoseMarketChartProp
  >(
    ['roseMarketChart', params.days],
    () =>
      getGetRoseMarketChart({
        days: params.days,
        // https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__market_chart
        // Change interval to daily data points if chart duration is greater or equal to a week
        interval: params.days >= chartDurationToDaysMap[ChartDuration.WEEK] ? 'daily' : undefined,
        vs_currency: 'usd',
      }),
    {
      select: ({ data }) => {
        // for 1 day filter we want less granular data so line chart looks good
        if (params.days === 1) {
          return data.prices.filter((value, index) => index % 12 == 0)
        }
        return data.prices
      },
      staleTime,
    },
  )
}
