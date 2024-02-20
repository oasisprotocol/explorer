import { Network } from './network'
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

export const networkToken: Record<Network, NativeTokenInfo> = {
  [Network.mainnet]: NativeToken.ROSE,
  [Network.testnet]: NativeToken.TEST,
}

export const getTokenForNetwork = (network: Network): NativeTokenInfo => networkToken[network]

export const getNameForTicker = (_t: TFunction, ticker: string): string => {
  // TODO: how do we translate ticker names?
  return ticker
}
