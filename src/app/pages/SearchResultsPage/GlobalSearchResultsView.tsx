import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getFilterForScope, getKeyForScope, getNameForScope } from '../../../types/searchScope'
import { RouteUtils } from '../../utils/route-utils'
import { SearchResults } from './hooks'
import { NoResults } from './NoResults'
import { SearchResultsFiltered } from './SearchResultsFiltered'
import { AllTokenPrices } from '../../../coin-gecko/api'

export const GlobalSearchResultsView: FC<{ searchResults: SearchResults; tokenPrices: AllTokenPrices }> = ({
  searchResults,
  tokenPrices,
}) => {
  const { t } = useTranslation()
  return searchResults.length === 0 ? (
    <NoResults />
  ) : (
    <>
      {RouteUtils.getEnabledSearchScopes().map(scope => (
        <SearchResultsFiltered
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
