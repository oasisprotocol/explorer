import { useOutletContext } from 'react-router'
import { useGetRuntimeRoflAppsIdInstancesRakTransactions } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { RuntimeScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit, paraTimesConfig } from '../../../config'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod/helpers'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'

export type RoflAppInstanceDetailsContext = {
  scope: RuntimeScope
  id: string
  rak: string
  txMethod: RuntimeTxMethodFilteringType
  setTxMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
}

export const useRoflAppInstanceDetailsProps = () => useOutletContext<RoflAppInstanceDetailsContext>()

export const useRoflAppInstanceRakTransactions = (
  scope: RuntimeScope,
  id: string,
  rak: string,
  method: string,
) => {
  const { network, layer } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  const query = useGetRuntimeRoflAppsIdInstancesRakTransactions(network, layer, id, rak, {
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
