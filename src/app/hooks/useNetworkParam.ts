import { useParams } from 'react-router-dom'
import { Network } from '../../types/network'
import { RouteUtils } from '../utils/route-utils'
import { AppError, AppErrors } from '../../types/errors'

export const useNetworkParam = (): Network | undefined => {
  const { network } = useParams()
  return network as Network | undefined
}

/**
 * Use this in situations where we can be sure that the network has already been checked
 */
export const useSafeNetworkParam = (): Network => {
  const network = useNetworkParam()
  if (!network || !RouteUtils.getEnabledNetworks().includes(network as any)) {
    throw new AppError(AppErrors.UnsupportedNetwork)
  }
  return network as Network
}
