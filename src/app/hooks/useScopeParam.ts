import { useRouteLoaderData, useParams } from 'react-router-dom'
import { Network } from '../../types/network'
import { AppError, AppErrors } from '../../types/errors'
import { SearchScope } from '../../types/searchScope'

export const useNetworkParam = (): Network | undefined => {
  const { network } = useParams()
  return network as Network | undefined
}

/**
 * Use this in situations where we might or might not have a scope
 */
export const useScopeParam = (): SearchScope | undefined => {
  const runtimeScope = useRouteLoaderData('runtimeScope') as SearchScope | undefined
  const consensusScope = useRouteLoaderData('consensusScope') as SearchScope | undefined
  return runtimeScope ?? consensusScope ?? undefined
}

/**
 * Use this in situations where we require to have a scope
 */
export const useRequiredScopeParam = (): SearchScope => {
  const scope = useScopeParam()

  if (!scope) throw new AppError(AppErrors.UnsupportedNetwork)

  return scope
}
