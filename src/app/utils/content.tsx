import { ReactNode } from 'react'
import { TFunction } from 'i18next'
import { Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { MainnetIcon } from '../components/CustomIcons/Mainnet'
import { TestnetIcon } from '../components/CustomIcons/Testnet'

export const getLayerLabels = (t: TFunction): Record<Layer, string> => ({
  [Layer.emerald]: t('common.emerald'),
  [Layer.sapphire]: t('common.sapphire'),
  [Layer.cipher]: t('common.cipher'),
  [Layer.pontusxdev]: t('common.pontusx'), // TODO
  [Layer.pontusx]: t('common.pontusx'), // TODO
  [Layer.consensus]: t('common.consensus'),
})

export const getNetworkIcons = ({ size }: { size?: number } = {}): Record<Network, ReactNode> => ({
  [Network.mainnet]: <MainnetIcon sx={{ fontSize: size }} />,
  [Network.testnet]: <TestnetIcon sx={{ fontSize: size }} />,
})
