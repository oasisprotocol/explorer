import { useGetStatus } from '../../../oasis-indexer/api'
import { Network } from '../../../types/network'

export const useIsApiOffline = (network: Network) => {
  const query = useGetStatus(network)
  return query.isFetched && !query.isSuccess
}
