import { Address, EthOrOasisAddress, Layer } from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { getOasisAddress } from '../../utils/helpers'
import { wRose } from './wrose'
import { TFunction } from 'i18next'

export type DappReference = {
  description: string
  label: string
  url: string
}

export type DappReferenceGenerator = (t: TFunction) => DappReference

const dappsForToken: Record<Network, Partial<Record<Layer, Record<Address, DappReferenceGenerator>>>> = {
  [Network.testnet]: {
    [Layer.sapphire]: {
      [getOasisAddress(wRose.testnetAddress)]: wRose.app,
    },
  },
  [Network.mainnet]: {
    [Layer.sapphire]: {
      [getOasisAddress(wRose.mainnetAddress)]: wRose.app,
    },
  },
  [Network.localnet]: {
    [Layer.sapphire]: undefined,
  },
}

/**
 * Return a dApp relevant to a given address, what we want to advertise
 */
export const getDappForAddress = (
  t: TFunction,
  network: Network,
  layer: Layer,
  ethOrOasisAddress: EthOrOasisAddress,
) => {
  const oasisAddress = getOasisAddress(ethOrOasisAddress)
  const generator = dappsForToken[network]?.[layer]?.[oasisAddress]
  const dApp = generator ? generator(t) : undefined
  return dApp
}
