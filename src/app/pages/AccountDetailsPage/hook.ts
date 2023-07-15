import {
  Layer,
  RuntimeEvent,
  useGetRuntimeAccountsAddress,
  useGetRuntimeEvents,
  useGetRuntimeTransactions,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { SearchScope } from '../../../types/searchScope'
import { useClientSizePagination } from '../../components/Table/useClientSidePagination'

export const useAccount = (scope: SearchScope, oasisAddress: string) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeAccountsAddress(network, layer, oasisAddress!)
  const account = query.data?.data
  const { isLoading, isError, isFetched } = query

  return { account, isLoading, isError, isFetched }
}

export const useAccountTransactions = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }
  const query = useGetRuntimeTransactions(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      offset: offset,
      rel: address,
    },
  )
  const { isFetched, isLoading, data } = query

  const transactions = data?.data.transactions
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

export const WANTED_EVM_LOG_EVENTS_FOR_LISTING_TRANSFERS: string[] = ['Transfer']

export const useAccountTokenTransfers = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useClientSizePagination({
    paramName: 'page',
    clientPageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    serverPageSize: 1000,
    filter: (event: RuntimeEvent) =>
      !!event.evm_log_name && WANTED_EVM_LOG_EVENTS_FOR_LISTING_TRANSFERS.includes(event.evm_log_name),
  })

  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }
  const query = useGetRuntimeEvents(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      ...pagination.paramsForQuery,
      rel: address,
      type: 'evm.log',
    },
  )

  const { isFetched, isLoading, data } = query

  return {
    isLoading,
    isFetched,
    results: pagination.getResults(data?.data),
  }
}
