import { TFunction } from 'i18next'
import { Layer } from '../oasis-indexer/api'

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
