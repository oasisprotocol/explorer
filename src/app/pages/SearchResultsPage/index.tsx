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
import { Network } from '../../../types/network'
import { useNetworkParam } from '../../hooks/useNetworkParam'
import { ResultsOnNetwork } from './ResultsOnNetwork'
import {
  SearchQueries,
  useBlocksConditionally,
  useRuntimeAccountConditionally,
  useTransactionsConditionally,
} from './hooks'
import { ResultsOnForeignNetworkThemed } from './ResultsOnForeignNetworkThemed'
import { ResultsOnNetworkThemed } from './ResultsOnNetworkThemed'

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
  wantedNetwork?: Network
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ wantedNetwork, searchQueries, roseFiatValue }) => {
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const allResults = Object.values(searchQueries).flatMap<HasNetwork>(query => query.results ?? [])

  const allNetworks = RouteUtils.getEnabledNetworks()

  const resultsInNetworks: Record<Network, number> = {} as any

  if (!isAnyLoading) {
    allNetworks.forEach(net => (resultsInNetworks[net] = 0))
    allResults.forEach(result => resultsInNetworks[result.network]++)
  }

  const matchingNetworkList = allNetworks.filter(net => !!resultsInNetworks[net])

  const isGlobal = !wantedNetwork

  const hasNoResultsWhatsoever = allResults.length === 0
  const hasNoResultsOnWantedNetwork = !isGlobal && resultsInNetworks[wantedNetwork] === 0

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
          <ResultsOnNetwork
            network={wantedNetwork}
            searchQueries={searchQueries}
            roseFiatValue={roseFiatValue}
          />
        </>
      )}
      {!isGlobal &&
        !isAnyLoading &&
        matchingNetworkList
          .filter(net => net !== wantedNetwork)
          .map(net => (
            <ResultsOnForeignNetworkThemed
              key={net}
              network={net}
              searchQueries={searchQueries}
              numberOfResults={resultsInNetworks[net]}
              roseFiatValue={roseFiatValue}
              openByDefault={net === Network.mainnet && !hasNoResultsOnWantedNetwork}
              alsoHasLocalResults={!hasNoResultsOnWantedNetwork}
            />
          ))}

      {isGlobal &&
        !isAnyLoading &&
        allNetworks
          .filter(net => resultsInNetworks[net])
          .map(net => (
            <ResultsOnNetworkThemed
              key={net}
              network={net}
              searchQueries={searchQueries}
              roseFiatValue={roseFiatValue}
            />
          ))}
    </PageLayout>
  )
}
