import { getNetworkNames, Network } from './network'
import { getLayerNames } from './layers'
import { HasScope, Layer } from '../oasis-nexus/api'
import { TFunction } from 'i18next'

export interface SearchScope {
  network: Network
  layer: Layer
}

/**
 * Use this in situations where a proposed search scope might be invalid
 */
export type SearchScopeCandidate = SearchScope & {
  valid: boolean
}

export const MainnetEmerald: SearchScope = {
  network: Network.mainnet,
  layer: Layer.emerald,
}

export const getNameForScope = (t: TFunction, scope: SearchScope) =>
  `${getLayerNames(t)[scope.layer]} ${getNetworkNames(t)[scope.network]}`

export const getKeyForScope: (scope: SearchScope) => string = ({ network, layer }) => `${network}.${layer}`

export const isItemInScope = (item: HasScope, scope: SearchScope): boolean =>
  item.network === scope.network && item.layer === scope.layer

export const getFilterForScope = (scope: SearchScope) => (item: HasScope) => isItemInScope(item, scope)
export const getInverseFilterForScope = (scope: SearchScope) => (item: HasScope) =>
  !isItemInScope(item, scope)
