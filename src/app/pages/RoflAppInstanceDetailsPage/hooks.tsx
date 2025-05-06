import { useOutletContext } from 'react-router-dom'
import { Layer, useGetRuntimeRoflAppsIdInstancesRakTransactions } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import { useSearchParamsPagination } from '../..//components/Table/useSearchParamsPagination'

export type RoflAppInstanceDetailsContext = {
  scope: SearchScope
  id: string
  rak: string
  method: string
  setMethod: (value: string) => void
}

export const useRoflAppInstanceDetailsProps = () => useOutletContext<RoflAppInstanceDetailsContext>()

export const useRoflAppInstanceRakTransactions = (
  scope: SearchScope,
  id: string,
  rak: string,
  method: string,
) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer !== Layer.sapphire) {
    throw AppErrors.UnsupportedLayer
  }

  const query = useGetRuntimeRoflAppsIdInstancesRakTransactions(network, Layer.sapphire, id, rak, {
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
