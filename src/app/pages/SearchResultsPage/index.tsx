import React, { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { TokenPriceInfo, useTokenPrice } from '../../../coin-gecko/api'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { NoResults } from './NoResults'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { ResultsOnNetwork } from './ResultsOnNetwork'
import { SearchResults, useSearch } from './hooks'
import { ResultsOnForeignNetworkThemed } from './ResultsOnForeignNetworkThemed'
import { ResultsOnNetworkThemed } from './ResultsOnNetworkThemed'
import { SearchScope } from '../../../types/searchScope'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useParamSearch } from '../../components/Search/search-utils'

export const SearchResultsPage: FC = () => {
  const tokenPrices: Record<Network, TokenPriceInfo> = {} as any
  // The list of networks will never change on the run, so we can do this
  // eslint-disable-next-line react-hooks/rules-of-hooks
  RouteUtils.getEnabledNetworks().forEach(net => (tokenPrices[net] = useTokenPrice(net)))

  const scope = useScopeParam()
  const searchParams = useParamSearch()
  const { results, isLoading } = useSearch(searchParams)

  useRedirectIfSingleResult()

  return (
    <SearchResultsView
      wantedScope={scope}
      searchResults={results}
      isLoading={isLoading}
      tokenPrices={tokenPrices}
    />
  )
}

export const SearchResultsView: FC<{
  wantedScope?: SearchScope
  searchResults: SearchResults
  isLoading: boolean
  tokenPrices: Record<Network, TokenPriceInfo>
}> = ({ wantedScope, searchResults, isLoading, tokenPrices }) => {
  // const allResults = getAllSearchResults(searchQueries)

  const allNetworks = RouteUtils.getEnabledNetworks()

  const resultsInNetworks: Record<Network, number> = {} as any

  if (!isLoading) {
    allNetworks.forEach(net => (resultsInNetworks[net] = 0))
    searchResults.allResults.forEach(result => resultsInNetworks[result.network]++)
  }

  const matchingNetworkList = allNetworks.filter(net => !!resultsInNetworks[net])

  const isGlobal = !wantedScope?.network

  const hasNoResultsWhatsoever = searchResults.allResults.length === 0
  const hasNoResultsOnWantedNetwork = !isGlobal && resultsInNetworks[wantedScope.network] === 0

  return (
    <PageLayout>
      <Divider variant="layout" />
      {isLoading && (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      )}

      {!isGlobal && !isLoading && hasNoResultsOnWantedNetwork && <NoResults scope={wantedScope} />}
      {isGlobal && !isLoading && hasNoResultsWhatsoever && <NoResults scope={wantedScope} />}

      {!isGlobal && !isLoading && !hasNoResultsOnWantedNetwork && (
        <>
          <ResultsOnNetwork
            network={wantedScope.network}
            searchResults={searchResults}
            tokenPriceInfo={tokenPrices[wantedScope.network]}
          />
        </>
      )}
      {!isGlobal &&
        !isLoading &&
        matchingNetworkList
          .filter(net => net !== wantedScope.network)
          .map(net => (
            <ResultsOnForeignNetworkThemed
              key={net}
              network={net}
              searchResults={searchResults}
              numberOfResults={resultsInNetworks[net]}
              tokenPriceInfo={tokenPrices[net]}
              openByDefault={net === Network.mainnet && !hasNoResultsOnWantedNetwork}
              alsoHasLocalResults={!hasNoResultsOnWantedNetwork}
            />
          ))}

      {isGlobal &&
        !isLoading &&
        allNetworks
          .filter(net => resultsInNetworks[net])
          .map(net => (
            <ResultsOnNetworkThemed
              key={net}
              network={net}
              searchResults={searchResults}
              tokenPriceInfo={tokenPrices[net]}
            />
          ))}
    </PageLayout>
  )
}
