import { TableLayout } from '../../components/TableLayoutButton'
import { useGetConsensusValidators, Validator, ValidatorList } from '../../../oasis-nexus/api'
import { useClientSidePagination } from '../../components/Table/useClientSidePagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Network } from '../../../types/network'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { hasTextMatch } from '../../components/HighlightedText/text-matching'
import { useTranslation } from 'react-i18next'

const useValidatorNameSearch = () => useTypedSearchParam('name', '', { deleteParams: ['page'] })

export const useValidatorFiltering = () => {
  const { t } = useTranslation()
  const [nameSearchInput, setNameSearchInput] = useValidatorNameSearch()
  const namePattern = nameSearchInput.length < 3 ? undefined : nameSearchInput
  const nameWarning = !!nameSearchInput && !namePattern ? t('tableSearch.error.tooShort') : undefined
  return { nameSearchInput, setNameSearchInput, namePattern, nameWarning }
}

export const useValidatorData = (network: Network, tableView: TableLayout) => {
  const { namePattern } = useValidatorFiltering()
  const nameFilter = namePattern
    ? (validator: Validator) => hasTextMatch(validator.media?.name, [namePattern])
    : undefined
  const pagination = useClientSidePagination<Validator, ValidatorList, [number, boolean]>({
    paramName: 'page',
    serverPageSize: 1000,
    clientPageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    transform: (data, r) => [
      data,
      [r.total_count, r.is_total_count_clipped], // Extract the real number of validators
    ],
    filter: nameFilter,
  })
  const { offset, limit } = pagination.paramsForServer
  const validatorsQuery = useGetConsensusValidators(network, {
    limit: tableView === TableLayout.Vertical ? offset + limit : limit,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = validatorsQuery
  return pagination.getResults(isLoading, isFetched, data?.data)
}
