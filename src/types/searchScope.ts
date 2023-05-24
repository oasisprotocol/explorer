import { getLayerNames, getNetworkNames, Network } from './network'
import { Layer } from '../oasis-indexer/api'
import { TFunction } from 'i18next'

export interface SearchScope {
  network: Network
  layer: Layer
}

export interface ScopeWithKey extends SearchScope {
  key: string
}

export const getNameForScope = (t: TFunction, scope: SearchScope) =>
  `${getLayerNames(t)[scope.layer]} ${getNetworkNames(t)[scope.network]}`

export const getKeyForScope: (scope: SearchScope) => string = ({ network, layer }) => `${network}.${layer}`

export const getScopeForKey = (key: string): ScopeWithKey => {
  const parts = key.split('.')
  if (parts.length !== 2) {
    throw new Error(`Can't decode scope key ${key}`)
  }
  return {
    key,
    network: parts[0] as Network,
    layer: parts[1] as Layer,
  }
}
