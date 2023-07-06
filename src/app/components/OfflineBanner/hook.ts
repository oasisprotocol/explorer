import { Layer, useGetRuntimeStatus, useGetStatus } from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { SearchScope } from '../../../types/searchScope'
import { AppError, AppErrors } from '../../../types/errors'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { paraTimesConfig } from '../../../config'

export const useIsApiReachable = (
  network: Network,
): { reachable: true } | { reachable: false; reason: 'userOffline' | 'apiOffline' } => {
  const query = useGetStatus(network)
  if (query.isPaused) return { reachable: false, reason: 'userOffline' }
  if (query.isFetched && !query.isSuccess) return { reachable: false, reason: 'apiOffline' }
  return { reachable: true }
}

export type FreshnessInfo = {
  outOfDate?: boolean
  lastUpdate?: string
}

export const useRuntimeFreshness = (scope: SearchScope): FreshnessInfo => {
  const isApiReachable = useIsApiReachable(scope.network).reachable
  if (scope.layer === Layer.consensus) {
    throw new AppError(AppErrors.UnsupportedLayer)
  }
  const query = useGetRuntimeStatus(scope.network, scope.layer)
  const timeDistance = useFormattedTimestampString(query?.data?.data.latest_block_time)
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
  const data = query.data?.data
  if (!query.isSuccess || !data) {
    return {
      outOfDate: true,
    }
  }
  const { latest_block } = data
  if (latest_block === -1) {
    return {
      outOfDate: true,
    }
  }
  const timeSinceLastUpdate = query.dataUpdatedAt - new Date(data.latest_block_time).getTime()
  const { outOfDateThreshold } = paraTimesConfig[scope.layer]
  return {
    outOfDate: timeSinceLastUpdate > outOfDateThreshold,
    lastUpdate: timeDistance,
  }
}
