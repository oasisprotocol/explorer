import { useOutletContext } from 'react-router-dom'
import {
  useGetRuntimeRoflAppsIdTransactions,
  useGetRuntimeRoflAppsIdInstanceTransactions,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { RuntimeScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit, paraTimesConfig } from '../../../config'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'

export type RoflAppDetailsContext = {
  scope: RuntimeScope
  id: string
  txMethod: RuntimeTxMethodFilteringType
  setTxMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
}

export const useRoflAppDetailsProps = () => useOutletContext<RoflAppDetailsContext>()

export const useRoflAppUpdates = (scope: RuntimeScope, id: string, method: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  const query = useGetRuntimeRoflAppsIdTransactions(network, layer, id, {
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

export const useRoflAppInstanceTransactions = (scope: RuntimeScope, id: string, method: string) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  const query = useGetRuntimeRoflAppsIdInstanceTransactions(network, layer, id, {
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
