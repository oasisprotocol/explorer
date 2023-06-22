import { Network } from './network'
import { TFunction } from 'i18next'

export type NativeTicker = (typeof Ticker)[keyof typeof Ticker]

export const Ticker = {
  ROSE: 'ROSE',
  TEST: 'TEST',
} as const

const networkTicker: Record<Network, NativeTicker> = {
  [Network.mainnet]: Ticker.ROSE,
  [Network.testnet]: Ticker.TEST,
}

export const getTickerForNetwork = (network: Network): NativeTicker => networkTicker[network]

export const getNameForTicker = (t: TFunction, ticker: string): string => {
  // TODO: how do we translate ticker names?
  return ticker
}
