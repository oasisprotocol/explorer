import { ReactNode } from 'react'
import { TFunction } from 'i18next'
import { Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { MainnetIcon } from '../components/CustomIcons/Mainnet'
import { TestnetIcon } from '../components/CustomIcons/Testnet'
import ConstructionIcon from '@mui/icons-material/Construction'

export const getLayerLabels = (t: TFunction): Record<Layer, string> => ({
  emerald: t('common.emerald'),
  sapphire: t('common.sapphire'),
  cipher: t('common.cipher'),
  pontusxdev: t('pontusx.devnet'),
  pontusxtest: t('pontusx.testnet'),
  consensus: t('common.consensus'),
})

export const getNetworkIcons = ({ size }: { size?: number } = {}): Record<Network, ReactNode> => ({
  [Network.mainnet]: <MainnetIcon sx={{ fontSize: size }} />,
  [Network.testnet]: <TestnetIcon sx={{ fontSize: size }} />,
  [Network.localnet]: <ConstructionIcon sx={{ fontSize: size }} />,
})
