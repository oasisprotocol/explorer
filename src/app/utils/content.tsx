import { ReactNode } from 'react'
import { TFunction } from 'i18next'
import { Layer } from '../../oasis-indexer/api'
import { Network } from '../../types/network'
import { MainnetIcon } from '../components/CustomIcons/Mainnet'
import { TestnetIcon } from '../components/CustomIcons/Testnet'

export const getLayerLabels = (t: TFunction): Record<Layer, string> => ({
  [Layer.emerald]: t('common.emerald'),
  [Layer.sapphire]: t('common.sapphire'),
  [Layer.cipher]: t('common.cipher'),
  [Layer.consensus]: t('common.consensus'),
})

export const getNetworkIcons = (): Record<Network, ReactNode> => ({
  [Network.mainnet]: <MainnetIcon />,
  [Network.testnet]: <TestnetIcon />,
})
