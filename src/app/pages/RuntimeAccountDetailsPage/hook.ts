import {
  Layer,
  useGetRuntimeAccountsAddress,
  useGetRuntimeEvents,
  useGetRuntimeTransactions,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { SearchScope } from '../../../types/searchScope'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'

export const useAccount = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeAccountsAddress(network, layer, address)
  const account = query.data?.data

  const { isLoading, isError, isFetched } = query

  return { account, isLoading, isError, isFetched }
}

export const useAccountTransactions = (scope: SearchScope, address: string, method: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }

  const query = useGetRuntimeTransactions(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      limit,
      offset: offset,
      rel: address,
      ...getRuntimeTransactionMethodFilteringParam(method),
    },
  )
  const { isFetched, isLoading, data } = query
  const transactions = data?.data.transactions

  if (isFetched && pagination.selectedPage > 1 && !transactions?.length) {
    throw AppErrors.PageDoesNotExist
  }

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return {
    isLoading,
    isFetched,
    transactions,
    pagination,
    totalCount,
    isTotalCountClipped,
  }
}

export const useAccountEvents = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading events on the consensus layer is not supported yet.
    // We should use useGetConsensusEvents()
  }

  const query = useGetRuntimeEvents(network, layer, {
    limit,
    offset: offset,
    rel: address,
    // TODO: implement filtering for non-transactional events
  })
  const { isFetched, isLoading, isError, data } = query
  const events = data?.data.events

  if (isFetched && pagination.selectedPage > 1 && !events?.length) {
    throw AppErrors.PageDoesNotExist
  }

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return { isFetched, isLoading, isError, events, pagination, totalCount, isTotalCountClipped }
}
