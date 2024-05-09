import { TableLayout } from '../../components/TableLayoutButton'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as pageSize } from '../../config'
import { Network } from '../../../types/network'

export const useLoadedValidators = (network: Network, tableView: TableLayout) => {
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * pageSize
  const validatorsQuery = useGetConsensusValidators(network, {
    limit: tableView === TableLayout.Vertical ? offset + pageSize : pageSize,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = validatorsQuery
  const validatorsData = data?.data
  return { pagination, pageSize, isLoading, isFetched, validatorsData }
}
