import {
  Layer,
  RuntimeEventType,
  useGetRuntimeAccountsAddress,
  useGetRuntimeEvents,
  useGetRuntimeTransactions,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { SearchScope } from '../../../types/searchScope'
import { EventFilterMode } from '../../components/RuntimeEvents/EventListFilterSwitch'
import { useTransformToOasisAddress } from '../../hooks/useTransformToOasisAddress'

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

export const useAccountTransactions = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }

  const oasisAddress = useTransformToOasisAddress(address)
  const query = useGetRuntimeTransactions(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      offset: offset,
      rel: oasisAddress!,
    },
    {
      query: {
        enabled: !!oasisAddress,
      },
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

export const useAccountEvents = (scope: SearchScope, address: string, filterMode: EventFilterMode) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading events on the consensus layer is not supported yet.
    // We should use useGetConsensusEvents()
  }

  const oasisAddress = useTransformToOasisAddress(address)
  const query = useGetRuntimeEvents(
    network,
    layer,
    {
      rel: oasisAddress!,
      // TODO: implement filtering for non-transactional events
    },
    {
      query: {
        enabled: !!oasisAddress,
      },
    },
  )
  const { isFetched, isLoading, isError, data } = query
  const events = data?.data.events.filter(
    event => filterMode === EventFilterMode.All || event.type !== RuntimeEventType.accountstransfer,
  )
  return { isFetched, isLoading, isError, events }
}
