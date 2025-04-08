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
  const query = useGetStatus(network, { query: { useErrorBoundary: false } })
  if (query.isPaused) return { reachable: false, reason: 'userOffline' }
  if (query.isFetched && !query.isSuccess) return { reachable: false, reason: 'apiOffline' }
  return { reachable: true }
}

export type FreshnessInfo = {
  unavailable?: boolean
  outOfDate?: boolean
  outOfDateReason?: false | 'indexer' | 'blocks' | 'node'
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
      outOfDateReason: 'indexer',
    }
  }

  if (query.isLoading) {
    return {
      outOfDate: undefined,
      outOfDateReason: undefined,
    }
  }

  if (!isApiReachable) {
    // The error state will be handled by NetworkOfflineBanner,
    // no need to display another banner whining about obsolete data.
    return {
      outOfDate: false,
      outOfDateReason: false,
    }
  }
  if (!query.isSuccess || !data) {
    return {
      outOfDate: true,
      outOfDateReason: 'indexer',
    }
  }
  if (data.latest_block === -1) {
    return {
      outOfDate: true,
      outOfDateReason: 'indexer',
    }
  }
  const timeSinceLastUpdate = query.dataUpdatedAt - new Date(data.latest_block_time).getTime()
  return {
    outOfDate: timeSinceLastUpdate > outOfDateThreshold,
    outOfDateReason: timeSinceLastUpdate > outOfDateThreshold ? 'indexer' : false,
    lastUpdate: lastUpdate,
    latestBlock,
  }
}

export const useConsensusFreshness = (
  network: Network,
  queryParams: { polling?: boolean } = {},
): FreshnessInfo => {
  const query = useGetStatus(network, {
    query: { refetchInterval: queryParams.polling ? 8000 : undefined, useErrorBoundary: false },
  })
  const data = query.data?.data
  const freshness = useFreshness(network, query)

  if (!data) return freshness

  const blockInterval = 6 * 1000
  const blocksAreBehindNode = data.latest_node_block > data.latest_block + outOfDateThreshold / blockInterval
  const nodeIsOutOfDate = freshness.outOfDate && data.latest_node_block === data.latest_block
  const outOfDateReason = blocksAreBehindNode
    ? 'blocks'
    : nodeIsOutOfDate
      ? 'node'
      : freshness.outOfDateReason
  return {
    ...freshness,
    outOfDate: outOfDateReason === undefined ? undefined : !!outOfDateReason,
    outOfDateReason: outOfDateReason,
  }
}

export const useRuntimeFreshness = (
  scope: SearchScope,
  queryParams: { polling?: boolean } = {},
): FreshnessInfo => {
  if (scope.layer === Layer.consensus) {
    throw new AppError(AppErrors.UnsupportedLayer)
  }

  const query = useGetRuntimeStatus(scope.network, scope.layer, {
    query: { refetchInterval: queryParams.polling ? 8000 : undefined, useErrorBoundary: false },
  })

  return useFreshness(scope.network, query)
}
