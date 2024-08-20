import { getNetworkNames, Network } from './network'
import { getLayerLabels } from '../app/utils/content'
import { HasScope, Layer } from '../oasis-nexus/api'
import { TFunction } from 'i18next'
import { paraTimesConfig, specialScopeNames } from '../config'

export interface SearchScope {
  network: Network
  layer: Layer
}

export const MainnetEmerald: SearchScope = {
  network: Network.mainnet,
  layer: Layer.emerald,
}

export const getNameForScope = (t: TFunction, scope: SearchScope) =>
  specialScopeNames[scope.network]?.[scope.layer] ??
  `${getLayerLabels(t)[scope.layer]} ${getNetworkNames(t)[scope.network]}`

export const getNameForScopeByRuntimeId = (t: TFunction, runtimeId: string, network: Network) => {
  const layer = (Object.keys(paraTimesConfig) as Array<keyof typeof paraTimesConfig>).find(
    layer => paraTimesConfig[layer]?.[network]?.runtimeId === runtimeId,
  )
  if (!layer) {
    return
  }

  return getNameForScope(t, { network, layer })
}

export const getKeyForScope: (scope: SearchScope) => string = ({ network, layer }) => `${network}.${layer}`

export const isItemInScope = (item: HasScope, scope: SearchScope): boolean =>
  item.network === scope.network && item.layer === scope.layer

export const getFilterForScope = (scope: SearchScope) => (item: HasScope) => isItemInScope(item, scope)
export const getInverseFilterForScope = (scope: SearchScope) => (item: HasScope) =>
  !isItemInScope(item, scope)
