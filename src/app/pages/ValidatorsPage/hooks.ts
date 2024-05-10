import { TableLayout } from '../../components/TableLayoutButton'
import { useGetConsensusValidators, Validator, ValidatorList } from '../../../oasis-nexus/api'
import { useClientSidePagination } from '../../components/Table/useClientSidePagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Network } from '../../../types/network'

export const useLoadedValidators = (network: Network, tableView: TableLayout) => {
  const pagination = useClientSidePagination<Validator, ValidatorList>({
    paramName: 'page',
    serverPageSize: 1000,
    clientPageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
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
