import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getFilterForNetwork, getNetworkNames, isOnMainnet, Network } from '../../../types/network'
import {
  getFilterForScope,
  getNameForScope,
  getInverseFilterForScope,
  SearchScope,
} from '../../../types/searchScope'
import { getThemesForNetworks } from '../../../styles/theme'
import { RouteUtils } from '../../utils/route-utils'
import { SearchResults } from './hooks'
import { SearchResultsList } from './SearchResultsList'
import { NoResultsInScope } from './NoResults'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { HideMoreResults, ShowMoreResults } from './notifications'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'

export const ScopedSearchResultsView: FC<{
  wantedScope: SearchScope
  searchTerm: string
  searchResults: SearchResults
  isPotentiallyIncomplete: boolean // Some of the searches failed, so we might not see everything // TODO: indicate this on the UI
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchTerm, searchResults, tokenPrices }) => {
  const { t } = useTranslation()
  const [othersOpen, setOthersOpen] = useState(false)
  const networkNames = getNetworkNames(t)
  const themes = getThemesForNetworks()
  const isInWantedScope = getFilterForScope(wantedScope)
  const isNotInWantedScope = getInverseFilterForScope(wantedScope)
  const wantedResults = searchResults.filter(isInWantedScope)
  const otherResults = searchResults.filter(isNotInWantedScope)
  const notificationTheme = themes[otherResults.some(isOnMainnet) ? Network.mainnet : Network.testnet]

  useRedirectIfSingleResult(wantedScope, searchTerm, searchResults)

  return (
    <>
      {wantedResults.length ? (
        <SearchResultsList
          title={getNameForScope(t, wantedScope)}
          searchTerm={searchTerm}
          searchResults={wantedResults}
          networkForTheme={wantedScope.network}
          tokenPrices={tokenPrices}
        />
      ) : (
        <NoResultsInScope scope={wantedScope} />
      )}
      {othersOpen ? (
        <>
          <HideMoreResults theme={notificationTheme} onHide={() => setOthersOpen(false)} />
          {RouteUtils.getEnabledNetworks()
            .filter(net => net !== wantedScope.network)
            .map(net => (
              <SearchResultsList
                key={net}
                networkForTheme={net}
                title={networkNames[net]}
                searchTerm={searchTerm}
                searchResults={otherResults.filter(getFilterForNetwork(net))}
                tokenPrices={tokenPrices}
              />
            ))}
        </>
      ) : (
        !!otherResults.length && (
          <ShowMoreResults
            theme={notificationTheme}
            onShow={() => setOthersOpen(true)}
            hasWantedResults={!!wantedResults.length}
            otherResultsCount={otherResults.length}
          />
        )
      )}
    </>
  )
}
