import { Layer } from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { wRose } from './wrose'
import { TFunction } from 'i18next'

export type DappReference = {
  description: string
  label: string
  url: string
}

export type DappReferenceGenerator = (t: TFunction) => DappReference

const dappsForToken: Record<Network, Partial<Record<Layer, Record<string, DappReferenceGenerator>>>> = {
  [Network.testnet]: {
    [Layer.sapphire]: {
      [wRose.testnetAddress]: wRose.app,
    },
  },
  [Network.mainnet]: {
    [Layer.sapphire]: {
      [wRose.mainnetAddress]: wRose.app,
    },
  },
  [Network.localnet]: {
    [Layer.sapphire]: undefined,
  },
}

/**
 * Return a dApp relevant to a given address, what we want to advertise
 */
export const getDappForEthAddress = (t: TFunction, network: Network, layer: Layer, ethAddress: string) => {
  const generator = dappsForToken[network]?.[layer]?.[ethAddress]
  const dApp = generator ? generator(t) : undefined
  return dApp
}
