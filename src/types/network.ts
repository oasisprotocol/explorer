import { TFunction } from 'i18next'

export type Network = (typeof Network)[keyof typeof Network]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  localnet: 'localnet',
} as const

export const getNetworkNames = (t: TFunction): Record<Network, string> => ({
  mainnet: t('common.mainnet'),
  testnet: t('common.testnet'),
  localnet: t('common.localnet'),
})

interface HasNetwork {
  network: Network
}

export const getFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network === network
export const getInverseFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network !== network

export const isOnMainnet = getFilterForNetwork('mainnet')
export const isNotOnMainnet = getInverseFilterForNetwork('mainnet')
export const isOnTestnet = getFilterForNetwork('testnet')

export const isNotMainnet = (network: Network) => network !== 'mainnet'
