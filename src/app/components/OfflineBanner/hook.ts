import {
  Layer,
  getStatus,
  GetRuntimeStatus,
  useGetRuntimeStatus,
  useGetStatus,
} from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { SearchScope } from '../../../types/searchScope'
import { AppError, AppErrors } from '../../../types/errors'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { outOfDateThreshold } from '../../../config'
import { UseQueryResult } from '@tanstack/react-query'

export const useIsApiReachable = (
  network: Network,
): { reachable: true } | { reachable: false; reason: 'userOffline' | 'apiOffline' } => {
  const query = useGetStatus(network)
  if (query.isPaused) return { reachable: false, reason: 'userOffline' }
  if (query.isFetched && !query.isSuccess) return { reachable: false, reason: 'apiOffline' }
  return { reachable: true }
}

export type FreshnessInfo = {
  unavailable?: boolean
  outOfDate?: boolean
  lastUpdate?: string
  latestBlock?: number
}

const useFreshness = (
  network: Network,
  query: UseQueryResult<Awaited<ReturnType<typeof getStatus | typeof GetRuntimeStatus>>>,
): FreshnessInfo => {
  const isApiReachable = useIsApiReachable(network).reachable
  const data = query.data?.data
  const lastUpdate = useFormattedTimestampStringWithDistance(data?.latest_block_time)
  const latestBlock = data?.latest_block

  if (query.isError) {
    return {
      unavailable: true,
      outOfDate: true,
    }
  }

  if (query.isLoading) {
    return {
      outOfDate: undefined,
    }
  }

  if (!isApiReachable) {
    // The error state will be handled by NetworkOfflineBanner,
    // no need to display another banner whining about obsolete data.
    return {
      outOfDate: false,
    }
  }
  if (!query.isSuccess || !data) {
    return {
      outOfDate: true,
    }
  }
  if (data.latest_block === -1) {
    return {
      outOfDate: true,
    }
  }
  const timeSinceLastUpdate = query.dataUpdatedAt - new Date(data.latest_block_time).getTime()
  return {
    outOfDate: timeSinceLastUpdate > outOfDateThreshold,
    lastUpdate: lastUpdate,
    latestBlock,
  }
}

export const useConsensusFreshness = (network: Network): FreshnessInfo => {
  const query = useGetStatus(network)

  return useFreshness(network, query)
}

export const useRuntimeFreshness = (
  scope: SearchScope,
  queryParams: { polling?: boolean } = {},
): FreshnessInfo => {
  if (scope.layer === Layer.consensus) {
    throw new AppError(AppErrors.UnsupportedLayer)
  }

  const query = useGetRuntimeStatus(scope.network, scope.layer, {
    query: { refetchInterval: queryParams.polling ? 8000 : undefined },
  })

  return useFreshness(scope.network, query)
}
