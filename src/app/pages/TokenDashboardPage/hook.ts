import { Layer, useGetRuntimeEvents, useGetRuntimeEvmTokensAddress } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'

export const useTokenInfo = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeEvmTokensAddress(network, layer, address!)
  const token = query.data?.data
  const { isLoading, isError, isFetched } = query
  return { token, isLoading, isError, isFetched }
}

export const useTokenTransfers = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }
  const query = useGetRuntimeEvents(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      offset: offset,
      rel: address,
      // type: 'evm.log',
      // TODO: maybe restrict this more later.
      // If the token is a payable account (usually they're not, AFAIK),
      // this will also return events where tokens were transferred to or from the token account itself.
      // I think let's ignore this possibility for now.
      // We can limit these unwanted (?) results further by adding &type=evm.log
    },
  )

  const { isFetched, isLoading, data } = query

  const transfers = data?.data.events

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return {
    isLoading,
    isFetched,
    transfers,
    pagination,
    totalCount,
    isTotalCountClipped,
  }
}
