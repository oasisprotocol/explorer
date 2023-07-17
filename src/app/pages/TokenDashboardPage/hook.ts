import {
  Layer,
  RuntimeEvent,
  useGetRuntimeEvents,
  useGetRuntimeEvmTokensAddress,
  useGetRuntimeEvmTokensAddressHolders,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useClientSizePagination } from '../../components/Table/useClientSidePagination'

export const useTokenInfo = (scope: SearchScope, address: string, enabled = true) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeEvmTokensAddress(network, layer, address!, {
    query: { enabled },
  })
  const token = query.data?.data
  const { isLoading, isError, isFetched } = query
  return {
    token,
    isLoading: isLoading && enabled, // By default, we get true for isLoading on disabled queries. We don't want that.
    isError,
    isFetched,
  }
}

export const WANTED_EVM_LOG_EVENTS_FOR_LISTING_TOKEN_TRANSFERS: string[] = ['Transfer']

export const useTokenTransfers = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useClientSizePagination({
    paramName: 'page',
    clientPageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    serverPageSize: 1000,
    filter: (event: RuntimeEvent) =>
      !!event.evm_log_name && WANTED_EVM_LOG_EVENTS_FOR_LISTING_TOKEN_TRANSFERS.includes(event.evm_log_name),
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
      // TODO: maybe restrict this more later.
      // If the token is a payable account (usually they're not, AFAIK),
      // this will also return events where tokens were transferred to or from the token account itself.
      // I think let's ignore this possibility for now.
      // We can limit these unwanted (?) results further by adding &type=evm.log
    },
  )

  const { isFetched, isLoading, data } = query

  const results = pagination.getResults(data?.data)

  if (isFetched && pagination.selectedPage > 1 && !results.data?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return {
    isLoading,
    isFetched,
    results: pagination.getResults(data?.data),
  }
}

export const useTokenHolders = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // There are no token holders on the consensus layer.
  }
  const query = useGetRuntimeEvmTokensAddressHolders(network, layer, address, {
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: offset,
  })

  const { isFetched, isLoading, data } = query

  const holders = data?.data.holders

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return {
    isLoading,
    isFetched,
    holders,
    pagination,
    totalCount,
    isTotalCountClipped,
  }
}
