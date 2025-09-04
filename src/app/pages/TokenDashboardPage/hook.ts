import {
  RuntimeEvent,
  RuntimeEventList,
  useGetRuntimeEvents,
  useGetRuntimeEvmTokensAddress,
  useGetRuntimeEvmTokensAddressHolders,
  useGetRuntimeEvmTokensAddressNfts,
  useGetRuntimeAccountsAddressNfts,
  useGetRuntimeEvmTokensAddressNftsId,
  RuntimeEventType,
  GetRuntimeEventsParams,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { RuntimeScope } from '../../../types/searchScope'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useComprehensiveSearchParamsPagination } from '../../components/Table/useComprehensiveSearchParamsPagination'
import { getOasisAddress } from '../../utils/helpers'

interface UseTokenInfoParams {
  /** Defaults to true */
  enabled?: boolean
  useCaching?: boolean
}

export const useTokenInfo = (scope: RuntimeScope, address: string, params: UseTokenInfoParams = {}) => {
  const { network, layer } = scope
  const { enabled, useCaching } = params
  const query = useGetRuntimeEvmTokensAddress(network, layer, getOasisAddress(address), {
    query: {
      enabled,
      staleTime: useCaching ? 3600000 : undefined,
    },
  })
  const token = query.data?.data
  const { isLoading, isError, isFetched } = query
  return {
    token,
    isLoading: isLoading && enabled !== false, // By default, we get true for isLoading on disabled queries. We don't want that.
    isError,
    isFetched,
  }
}

export const useNFTInstanceTransfers = (
  scope: RuntimeScope,
  params: { nft_id: string; contract_address: string },
) => {
  return useTokenTransfers(scope, { nft_id: params.nft_id, contract_address: params.contract_address })
}

export const useTokenTransfers = (
  scope: undefined | RuntimeScope,
  params: undefined | GetRuntimeEventsParams,
  querySearchParamName?: string,
) => {
  if (params && Object.values(params).some(value => value === undefined || value === null)) {
    throw new Error('Must set params=undefined while some values are unavailable')
  }
  if (params && !scope) {
    throw new Error('Must set params=undefined while scope is unavailable')
  }
  const mockScopeForDisabledQuery = { network: 'mainnet', layer: 'sapphire' } as const

  const pagination = useComprehensiveSearchParamsPagination<RuntimeEvent, RuntimeEventList>({
    paramName: querySearchParamName ?? 'page',
    pageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
  })
  const query = useGetRuntimeEvents(
    scope?.network ?? mockScopeForDisabledQuery.network,
    scope?.layer ?? mockScopeForDisabledQuery.layer, // This is OK since consensus has been handled separately
    {
      ...pagination.paramsForQuery,
      type: RuntimeEventType.evmlog,
      // The following is the hex-encoded signature for Transfer(address,address,uint256)
      evm_log_signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ...params,
    },
    {
      query: {
        enabled: !!params,
      },
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

export const useTokenHolders = (scope: RuntimeScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

  const query = useGetRuntimeEvmTokensAddressHolders(network, layer, address, {
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: offset,
  })

  const { isFetched, isLoading, data } = query

  const holders = data?.data.holders

  if (isFetched && pagination.selectedPage > 1 && !holders?.length) {
    throw AppErrors.PageDoesNotExist
  }

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

// specific to NFT gallery only
const NUMBER_OF_INVENTORY_ITEMS = 15

export const useTokenInventory = (scope: RuntimeScope, address: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_INVENTORY_ITEMS
  const query = useGetRuntimeEvmTokensAddressNfts(network, layer, address, {
    limit: NUMBER_OF_INVENTORY_ITEMS,
    offset: offset,
  })
  const { isFetched, isLoading, data } = query
  const inventory = data?.data.evm_nfts

  if (isFetched && pagination.selectedPage > 1 && !inventory?.length) {
    throw AppErrors.PageDoesNotExist
  }

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return {
    isLoading,
    isFetched,
    inventory,
    pagination: {
      ...pagination,
      isTotalCountClipped,
      rowsPerPage: NUMBER_OF_INVENTORY_ITEMS,
    },
    totalCount,
  }
}

export const useAccountTokenInventory = (scope: RuntimeScope, address: string, tokenAddress: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * NUMBER_OF_INVENTORY_ITEMS

  const query = useGetRuntimeAccountsAddressNfts(network, layer, address, {
    limit: NUMBER_OF_INVENTORY_ITEMS,
    offset: offset,
    token_address: tokenAddress,
  })
  const { isFetched, isLoading, data } = query
  const inventory = data?.data.evm_nfts

  if (isFetched && pagination.selectedPage > 1 && !inventory?.length) {
    throw AppErrors.PageDoesNotExist
  }

  const totalCount = data?.data.total_count
  const isTotalCountClipped = data?.data.is_total_count_clipped

  return {
    isLoading,
    isFetched,
    inventory,
    pagination: {
      ...pagination,
      rowsPerPage: NUMBER_OF_INVENTORY_ITEMS,
    },
    isTotalCountClipped,
    totalCount,
  }
}

export const useNFTInstance = (scope: RuntimeScope, address: string, id: string) => {
  const { network, layer } = scope
  const query = useGetRuntimeEvmTokensAddressNftsId(network, layer, address, id)

  const { data, isError, isFetched, isLoading } = query
  if (isError) {
    throw AppErrors.InvalidAddress
  }
  const nft = data?.data

  return {
    isLoading,
    isFetched,
    nft,
  }
}
