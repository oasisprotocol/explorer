import React, { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useParamSearch } from '../../components/Search/search-utils'
import { HasNetwork } from '../../../oasis-indexer/api'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { NoResults } from './NoResults'
import { RouteUtils } from '../../utils/route-utils'
import { GlobalNetwork, Network, NetworkOrGlobal } from '../../../types/network'
import { useNetworkParam } from '../../hooks/useNetworkParam'
import { SearchResultsList } from './SearchResultsList'
import {
  SearchQueries,
  useBlocksConditionally,
  useRuntimeAccountConditionally,
  useTransactionsConditionally,
} from './hooks'
import { ResultsOnForeignNetwork } from './ResultsOnForeignNetwork'
import { ResultsOnNetwork } from './ResultsOnNetwork'

export const SearchResultsPage: FC = () => {
  const q = useParamSearch()
  const rosePriceQuery = useGetRosePrice()
  const network = useNetworkParam()
  const searchQueries: SearchQueries = {
    blockHeight: useBlocksConditionally(q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    txHash: useTransactionsConditionally(q.txHash),
    oasisAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
  }

  useRedirectIfSingleResult(network, searchQueries)

  return (
    <SearchResultsView
      wantedNetwork={network}
      searchQueries={searchQueries}
      roseFiatValue={rosePriceQuery.data}
    />
  )
}

export const SearchResultsView: FC<{
  wantedNetwork: NetworkOrGlobal
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ wantedNetwork, searchQueries, roseFiatValue }) => {
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const allResults = Object.values(searchQueries).flatMap<HasNetwork>(query => query.results ?? [])

  const allNetworks = RouteUtils.getEnabledNetworks()

  const matchesInNetworks: Record<Network, number> = {} as any

  if (!isAnyLoading) {
    allNetworks.forEach(net => (matchesInNetworks[net] = 0))
    allResults.forEach(result => matchesInNetworks[result.network]++)
  }

  const matchingNetworkList = allNetworks.filter(net => !!matchesInNetworks[net])

  const isGlobal = wantedNetwork === GlobalNetwork

  const hasNoResultsWhatsoever = allResults.length === 0
  const hasNoResultsOnWantedNetwork = !isGlobal && matchesInNetworks[wantedNetwork] === 0

  return (
    <PageLayout>
      <Divider variant="layout" />
      {isAnyLoading && (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      )}

      {!isGlobal && !isAnyLoading && hasNoResultsOnWantedNetwork && <NoResults network={wantedNetwork} />}
      {isGlobal && !isAnyLoading && hasNoResultsWhatsoever && <NoResults network={wantedNetwork} />}

      {!isGlobal && !isAnyLoading && !hasNoResultsOnWantedNetwork && (
        <>
          <SearchResultsList
            network={wantedNetwork}
            searchQueries={searchQueries}
            roseFiatValue={roseFiatValue}
          />
        </>
      )}
      {!isGlobal &&
        !isAnyLoading &&
        matchingNetworkList
          .filter(n => n !== wantedNetwork)
          .map(n => (
            <ResultsOnForeignNetwork
              key={n}
              network={n}
              searchQueries={searchQueries}
              matches={matchesInNetworks[n]}
              roseFiatValue={roseFiatValue}
              openByDefault={n === Network.mainnet && !hasNoResultsOnWantedNetwork}
              hasLocalMatches={!hasNoResultsOnWantedNetwork}
            />
          ))}

      {isGlobal &&
        !isAnyLoading &&
        allNetworks
          .filter(net => matchesInNetworks[net])
          .map(net => (
            <ResultsOnNetwork
              key={net}
              network={net}
              searchQueries={searchQueries}
              roseFiatValue={roseFiatValue}
            />
          ))}
    </PageLayout>
  )
}
