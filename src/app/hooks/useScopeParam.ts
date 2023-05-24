import { useParams } from 'react-router-dom'
import { Network } from '../../types/network'
import { RouteUtils } from '../utils/route-utils'
import { AppError, AppErrors } from '../../types/errors'
import { SearchScope } from '../../types/searchScope'
import { Layer } from '../../oasis-indexer/api'

export const useNetworkParam = (): Network | undefined => {
  const { network } = useParams()
  return network as Network | undefined
}

/**
 * Use this in situations where we might or might not have a scope
 */
export const useScopeParam = (): SearchScope | undefined => {
  const { network, layer } = useParams()

  if (network === undefined && layer === undefined) return undefined

  if (network === undefined || layer === undefined) {
    throw new Error(
      'You must either specify both network and layer or none of them. You can not have one but not the other.',
    )
  }

  const scope: SearchScope = {
    network: network as Network,
    layer: layer as Layer,
  }

  if (!scope || !RouteUtils.getEnabledNetworks().includes(scope.network))
    throw new AppError(AppErrors.UnsupportedNetwork)

  if (!RouteUtils.getEnabledLayersForNetwork(scope.network).includes(scope.layer))
    throw new AppError(AppErrors.UnsupportedLayer)

  return scope
}

/**
 * Use this in situations where we require to have a scope
 */
export const useRequiredScopeParam = (): SearchScope => {
  const scope = useScopeParam()

  if (!scope) throw new AppError(AppErrors.UnsupportedNetwork)

  return scope
}
