import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getFilterForScope, getKeyForScope, getNameForScope } from '../../../types/searchScope'
import { RouteUtils } from '../../utils/route-utils'
import { SearchResults } from './hooks'
import { NoResults } from './NoResults'
import { SearchResultsList } from './SearchResultsList'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'

export const GlobalSearchResultsView: FC<{ searchResults: SearchResults; tokenPrices: AllTokenPrices }> = ({
  searchResults,
  tokenPrices,
}) => {
  const { t } = useTranslation()
  useRedirectIfSingleResult(undefined, searchResults)

  return searchResults.length === 0 ? (
    <NoResults />
  ) : (
    <>
      {RouteUtils.getEnabledSearchScopes().map(scope => (
        <SearchResultsList
          key={getKeyForScope(scope)}
          title={getNameForScope(t, scope)}
          searchResults={searchResults.filter(getFilterForScope(scope))}
          networkForTheme={scope.network}
          tokenPrices={tokenPrices}
        />
      ))}
    </>
  )
}
