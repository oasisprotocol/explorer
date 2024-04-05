import { TFunction } from 'i18next'

export type Ticker = (typeof Ticker)[keyof typeof Ticker]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Ticker = {
  ROSE: 'ROSE',
  TEST: 'TEST',
  EUROe: 'EUROe',
} as const

export type NativeTokenInfo = {
  ticker: Ticker
  free?: boolean
  geckoId?: string
}

export const NativeToken = {
  ROSE: {
    ticker: Ticker.ROSE,
    geckoId: 'oasis-network',
  },
  TEST: {
    ticker: Ticker.TEST,
    free: true,
  },
  EUROe: {
    ticker: Ticker.EUROe,
    geckoId: 'euroe-stablecoin',
  },
} as const

export const getNameForTicker = (_t: TFunction, ticker: string): string => {
  // TODO: how do we translate ticker names?
  return ticker
}
