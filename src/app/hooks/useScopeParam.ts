import { useParams, useRouteError } from 'react-router-dom'
import { Network } from '../../types/network'
import { RouteUtils } from '../utils/route-utils'
import { AppError, AppErrors } from '../../types/errors'
import { SearchScope } from '../../types/searchScope'
import { Layer } from '../../oasis-indexer/api'

export const useNetworkParam = (): Network | undefined => {
  const { network } = useParams()
  return network as Network | undefined
}

type ScopeInfo = SearchScope & {
  valid: boolean
}

/**
 * Use this in situations where we might or might not have a scope
 */
export const useScopeParam = (): ScopeInfo | undefined => {
  const { network, layer } = useParams()
  const error = useRouteError()

  if (network === undefined && layer === undefined) return undefined

  const scope: ScopeInfo = {
    network: network as Network,
    layer: layer as Layer,
    valid: true,
  }

  if (network === undefined || layer === undefined) {
    scope.valid = false
    if (!error)
      throw new Error(
        'You must either specify both network and layer or none of them. You can not have one but not the other.',
      )
  }

  if (!RouteUtils.getEnabledNetworks().includes(scope.network)) {
    scope.valid = false
    if (!error) throw new AppError(AppErrors.UnsupportedNetwork)
  }

  if (!RouteUtils.getEnabledLayersForNetwork(scope.network).includes(scope.layer)) {
    scope.valid = false
    if (!error) throw new AppError(AppErrors.UnsupportedLayer)
  }

  return scope
}

/**
 * Use this in situations where we require to have a scope
 */
export const useRequiredScopeParam = (): ScopeInfo => {
  const scope = useScopeParam()

  if (!scope) throw new AppError(AppErrors.UnsupportedNetwork)

  return scope
}
