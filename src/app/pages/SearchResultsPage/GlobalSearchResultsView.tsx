import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fixedNetwork, RouteUtils } from '../../utils/route-utils'
import { SearchResults } from './hooks'
import { NoResultsOnMainnet, NoResultsWhatsoever } from './NoResults'
import { SearchResultsList } from './SearchResultsList'
import { AllTokenPrices } from '../../../coin-gecko/api'
import {
  getFilterForNetwork,
  getNetworkNames,
  isNotMainnet,
  isNotOnMainnet,
  isOnMainnet,
  Network,
} from '../../../types/network'
import { HideMoreResults, ShowMoreResults } from './notifications'
import { getThemeForScope } from '../../../styles/theme'
import { orderByLayer } from '../../../types/layers'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { SearchParams } from '../../components/Search/search-utils'

export const GlobalSearchResultsView: FC<{
  searchParams: SearchParams
  searchResults: SearchResults
  isPotentiallyIncomplete: boolean // Some of the searches failed, so we might not see everything // TODO: indicate this on the UI
  tokenPrices: AllTokenPrices
}> = ({ searchParams, searchResults, tokenPrices }) => {
  const { t } = useTranslation()
  const [othersOpen, setOthersOpen] = useState(false)
  useRedirectIfSingleResult(undefined, searchParams, searchResults)

  const networkNames = getNetworkNames(t)
  const { searchTerm } = searchParams

  if (fixedNetwork) {
    return (
      <>
        {!searchResults.length && <NoResultsWhatsoever />}
        <SearchResultsList
          key={fixedNetwork}
          title={networkNames[fixedNetwork]}
          searchTerm={searchTerm}
          searchResults={searchResults}
          networkForTheme={fixedNetwork}
          tokenPrices={tokenPrices}
        />
      </>
    )
  }

  const otherNetworks = RouteUtils.getEnabledNetworks().filter(isNotMainnet)
  const notificationTheme = getThemeForScope(Network.testnet)
  const mainnetResults = searchResults.filter(isOnMainnet).sort(orderByLayer)
  const otherResults = searchResults.filter(isNotOnMainnet).sort(orderByLayer)

  return (
    <>
      {!mainnetResults.length && (otherResults.length ? <NoResultsOnMainnet /> : <NoResultsWhatsoever />)}
      {
        <SearchResultsList
          key={Network.mainnet}
          title={networkNames[Network.mainnet]}
          searchTerm={searchTerm}
          searchResults={mainnetResults}
          networkForTheme={Network.mainnet}
          tokenPrices={tokenPrices}
        />
      }
      {otherResults.length !== 0 &&
        (othersOpen ? (
          <>
            <HideMoreResults theme={notificationTheme} onHide={() => setOthersOpen(false)} />
            {otherNetworks.map(net => (
              <SearchResultsList
                key={net}
                title={networkNames[net]}
                searchTerm={searchTerm}
                searchResults={otherResults.filter(getFilterForNetwork(net))}
                networkForTheme={net}
                tokenPrices={tokenPrices}
              />
            ))}
          </>
        ) : (
          <ShowMoreResults
            theme={notificationTheme}
            hasWantedResults={!!mainnetResults.length}
            otherResultsCount={otherResults.length}
            onShow={() => setOthersOpen(true)}
          />
        ))}
    </>
  )
}
