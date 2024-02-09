import { useSearchParams } from 'react-router-dom'
import { Network } from '../../types/network'
import { fixedNetwork, RouteUtils } from '../utils/route-utils'
import { AppErrors } from '../../types/errors'

/**
 * Get the network from the URL search params and return it if it is valid,
 * otherwise fallback to mainnet
 */
export const useSearchQueryNetworkParam = (): {
  network: Network
  setNetwork: (network: Network) => void
} => {
  const [searchParams, setSearchParams] = useSearchParams()
  const networkQueryParam = fixedNetwork ?? searchParams.get('network') ?? Network.mainnet
  if (!RouteUtils.getEnabledNetworks().includes(networkQueryParam as any)) {
    throw AppErrors.InvalidUrl
  }
  return {
    network: networkQueryParam as Network,
    setNetwork: network => {
      if (network === Network.mainnet) {
        searchParams.delete('network')
      } else {
        searchParams.set('network', network)
      }
      setSearchParams(searchParams)
    },
  }
}
