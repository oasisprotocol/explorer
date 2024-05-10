import { TableLayout } from '../../components/TableLayoutButton'
import { useGetConsensusValidators, Validator, ValidatorList } from '../../../oasis-nexus/api'
import { useComprehensiveSearchParamsPagination } from '../../components/Table/useComprehensiveSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Network } from '../../../types/network'

export const useLoadedValidators = (network: Network, tableView: TableLayout) => {
  const pagination = useComprehensiveSearchParamsPagination<Validator, ValidatorList>({
    paramName: 'page',
    pageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
  })
  const offset = pagination.offsetForQuery
  const validatorsQuery = useGetConsensusValidators(network, {
    limit: tableView === TableLayout.Vertical ? offset + pagination.limitForQuery : pagination.limitForQuery,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = validatorsQuery
  const paginatedResults = pagination.getResults(data?.data)
  return {
    isLoading,
    isFetched,
    paginatedResults,
  }
}
