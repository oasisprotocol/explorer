import { TFunction } from 'i18next'

// Here we need to import from the generated code, in order to break
// a cycle of imports which confuse jest
// eslint-disable-next-line no-restricted-imports
import { Layer } from '../oasis-indexer/generated/api'

export type Network = (typeof Network)[keyof typeof Network]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
} as const

export const getNetworkNames = (t: TFunction): Record<Network, string> => ({
  [Network.mainnet]: t('common.mainnet'),
  [Network.testnet]: t('common.testnet'),
})

export const getLayerNames = (t: TFunction): Record<Layer, string> => ({
  [Layer.emerald]: t('common.emerald'),
  [Layer.sapphire]: t('common.sapphire'),
  [Layer.cipher]: t('common.cipher'),
  [Layer.consensus]: t('common.consensus'),
})

interface HasNetwork {
  network: Network
}

export const getFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network === network
export const getInverseFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network !== network

export const isOnMainnet = getFilterForNetwork(Network.mainnet)
export const isOnTestnet = getFilterForNetwork(Network.testnet)
