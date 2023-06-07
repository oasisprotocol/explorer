import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getFilterForLayer,
  getFilterForNetwork,
  getNetworkNames,
  isOnMainnet,
  Network,
} from '../../../types/network'
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
  searchResults: SearchResults
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchResults, tokenPrices }) => {
  const { t } = useTranslation()
  const [othersOpen, setOthersOpen] = useState(false)
  const networkNames = getNetworkNames(t)
  const themes = getThemesForNetworks()
  const isInWantedScope = getFilterForScope(wantedScope)
  const isNotInWantedScope = getInverseFilterForScope(wantedScope)
  const isOnTheRightParatime = getFilterForLayer(wantedScope.layer)
  const wantedResults = searchResults.filter(isInWantedScope)
  const hasWantedResults = !!wantedResults.length
  const otherResults = searchResults.filter(isNotInWantedScope).filter(isOnTheRightParatime)
  const hasMainnetResults = otherResults.some(isOnMainnet)
  const notificationTheme = themes[hasMainnetResults ? Network.mainnet : Network.testnet]

  useRedirectIfSingleResult(wantedScope, wantedResults)

  return (
    <>
      {hasWantedResults ? (
        <SearchResultsList
          title={getNameForScope(t, wantedScope)}
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
            hasWantedResults={hasWantedResults}
            otherResultsCount={otherResults.length}
          />
        )
      )}
    </>
  )
}
