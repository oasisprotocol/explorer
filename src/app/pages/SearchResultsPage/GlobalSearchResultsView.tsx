import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getFixedNetwork, hasFixedNetwork, RouteUtils } from '../../utils/route-utils'
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
import { getThemesForNetworks } from '../../../styles/theme'
import { isNotOnHiddenLayer, orderByLayer } from '../../../types/layers'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'

export const GlobalSearchResultsView: FC<{
  searchTerm: string
  searchResults: SearchResults
  tokenPrices: AllTokenPrices
}> = ({ searchTerm, searchResults, tokenPrices }) => {
  const { t } = useTranslation()
  const [othersOpen, setOthersOpen] = useState(false)
  useRedirectIfSingleResult(undefined, searchTerm, searchResults)

  const themes = getThemesForNetworks()
  const networkNames = getNetworkNames(t)

  if (hasFixedNetwork()) {
    const network = getFixedNetwork()!
    const wantedResults = searchResults.filter(result => result.network === network)
    return (
      <>
        {!wantedResults.length && <NoResultsWhatsoever />}
        <SearchResultsList
          key={network}
          title={networkNames[network]}
          searchTerm={searchTerm}
          searchResults={wantedResults}
          networkForTheme={network}
          tokenPrices={tokenPrices}
        />
      </>
    )
  }

  const otherNetworks = RouteUtils.getEnabledNetworks().filter(isNotMainnet)
  const notificationTheme = themes[Network.testnet]
  const mainnetResults = searchResults.filter(isOnMainnet).sort(orderByLayer)
  const otherResults = searchResults.filter(isNotOnMainnet).filter(isNotOnHiddenLayer).sort(orderByLayer)

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
