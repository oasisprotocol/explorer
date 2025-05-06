import { useOutletContext } from 'react-router-dom'
import {
  useGetRuntimeRoflAppsIdTransactions,
  Layer,
  useGetRuntimeRoflAppsIdInstanceTransactions,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import { useSearchParamsPagination } from '../..//components/Table/useSearchParamsPagination'

export type RoflAppDetailsContext = {
  scope: SearchScope
  id: string
  method: string
  setMethod: (value: string) => void
}

export const useRoflAppDetailsProps = () => useOutletContext<RoflAppDetailsContext>()

export const useRoflAppUpdates = (scope: SearchScope, id: string, method: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer !== Layer.sapphire) {
    throw AppErrors.UnsupportedLayer
  }

  const query = useGetRuntimeRoflAppsIdTransactions(network, Layer.sapphire, id, {
    limit,
    offset: offset,
    rel: id,
    ...getRuntimeTransactionMethodFilteringParam(method),
  })
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

export const useRoflAppInstanceTransactions = (scope: SearchScope, id: string, method: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer !== Layer.sapphire) {
    throw AppErrors.UnsupportedLayer
  }

  const query = useGetRuntimeRoflAppsIdInstanceTransactions(network, Layer.sapphire, id, {
    limit,
    offset: offset,
    ...getRuntimeTransactionMethodFilteringParam(method),
  })
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
