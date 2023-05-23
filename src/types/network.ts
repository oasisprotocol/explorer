import { TFunction } from 'i18next'

export type Network = (typeof Network)[keyof typeof Network]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
} as const

export const GlobalNetwork = 'global'

export type NetworkOrGlobal = Network | typeof GlobalNetwork

export const getNetworkNames = (t: TFunction): Record<Network, string> => ({
  [Network.mainnet]: t('common.mainnet'),
  [Network.testnet]: t('common.testnet'),
})
