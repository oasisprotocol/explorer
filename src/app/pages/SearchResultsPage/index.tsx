import React, { FC } from 'react'
import { useParamSearch } from '../../components/Search/search-utils'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useSearch } from './hooks'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { SearchResultsView } from './SearchResultsView'
import { useAllTokenPrices } from '../../../coin-gecko/api'

export const SearchResultsPage: FC = () => {
  const searchParams = useParamSearch()
  const scope = useScopeParam()
  const { results, isLoading } = useSearch(searchParams)

  const tokenPrices = useAllTokenPrices()

  useRedirectIfSingleResult(scope, isLoading, results)

  return (
    <SearchResultsView
      wantedScope={scope}
      searchResults={results}
      isLoading={isLoading}
      tokenPrices={tokenPrices}
    />
  )
}
