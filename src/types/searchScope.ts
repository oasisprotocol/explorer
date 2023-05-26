import { getLayerNames, getNetworkNames, Network } from './network'
import { Layer } from '../oasis-indexer/api'
import { TFunction } from 'i18next'

export interface SearchScope {
  network: Network
  layer: Layer
}

export const getNameForScope = (t: TFunction, scope: SearchScope) =>
  `${getLayerNames(t)[scope.layer]} ${getNetworkNames(t)[scope.network]}`
