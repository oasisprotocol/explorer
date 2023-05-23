import { useParams } from 'react-router-dom'
import { Network, NetworkOrGlobal } from '../../types/network'
import { RouteUtils } from '../utils/route-utils'
import { AppError, AppErrors } from '../../types/errors'

export const useNetworkParam = (): NetworkOrGlobal => {
  const { network } = useParams()

  return network as NetworkOrGlobal
}

/**
 * Use this in situations where we can be sure that the network has already been checked
 */
export const useSafeNetworkParam = (): Network => {
  const network = useNetworkParam()
  if (!RouteUtils.getEnabledNetworks().includes(network as any)) {
    throw new AppError(AppErrors.UnsupportedNetwork)
  }
  return network as Network
}
