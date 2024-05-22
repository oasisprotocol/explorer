import { FC } from 'react'
import { useParamSearch } from '../../components/Search/search-utils'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useSearch } from './hooks'
import { SearchResultsView } from './SearchResultsView'
import { useAllTokenPrices } from '../../../coin-gecko/api'
import { getFiatCurrencyForScope } from '../../../config'

export const SearchResultsPage: FC = () => {
  const searchParams = useParamSearch()
  const scope = useScopeParam()
  const { results, isLoading, hasErrors } = useSearch(scope, searchParams)

  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))

  return (
    <SearchResultsView
      wantedScope={scope}
      searchParams={searchParams}
      searchResults={results}
      isLoading={isLoading}
      isPotentiallyIncomplete={hasErrors}
      tokenPrices={tokenPrices}
    />
  )
}
