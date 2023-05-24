import React, { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useParamSearch } from '../../components/Search/search-utils'
import { HasScope } from '../../../oasis-indexer/api'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { NoResults } from './NoResults'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { ResultsInScope } from './ResultsInScope'
import {
  SearchQueries,
  useBlocksConditionally,
  useRuntimeAccountConditionally,
  useTransactionsConditionally,
} from './hooks'
import { ResultsInOtherScopesThemed } from './ResultsInOtherScopesThemed'
import { ResultsInScopeThemed } from './ResultsInScopeThemed'
import { getKeyForScope, getScopeForKey, SearchScope } from '../../../types/searchScope'
import { useScopeParam } from '../../hooks/useScopeParam'
import { offerSearchResultsFromDifferentParatimes } from '../../../config'

export const SearchResultsPage: FC = () => {
  const q = useParamSearch()
  const rosePriceQuery = useGetRosePrice()
  const scope = useScopeParam()
  const searchQueries: SearchQueries = {
    blockHeight: useBlocksConditionally(q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    txHash: useTransactionsConditionally(q.txHash),
    oasisAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
  }

  useRedirectIfSingleResult(scope, searchQueries)

  return (
    <SearchResultsView
      wantedScope={scope}
      searchQueries={searchQueries}
      roseFiatValue={rosePriceQuery.data}
    />
  )
}

export const SearchResultsView: FC<{
  wantedScope?: SearchScope
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ wantedScope, searchQueries, roseFiatValue }) => {
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const allResults = Object.values(searchQueries).flatMap<HasScope>(query => query.results ?? [])

  const allScopes = RouteUtils.getEnabledSearchScopes().map(getKeyForScope)

  const resultsInScopes: Record<string, number> = {} as any

  if (!isAnyLoading) {
    allScopes.forEach(key => (resultsInScopes[key] = 0))
    allResults.forEach(result => resultsInScopes[getKeyForScope(result)]++)
  }

  const matchingScopeList = allScopes.filter(key => !!resultsInScopes[key])

  const isGlobal = !wantedScope

  const hasNoResultsWhatsoever = allResults.length === 0
  const hasNoResultsInWantedScope = !isGlobal && resultsInScopes[getKeyForScope(wantedScope)] === 0

  return (
    <PageLayout>
      <Divider variant="layout" />
      {isAnyLoading && (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      )}

      {!isGlobal && !isAnyLoading && hasNoResultsInWantedScope && <NoResults scope={wantedScope} />}
      {isGlobal && !isAnyLoading && hasNoResultsWhatsoever && <NoResults scope={wantedScope} />}

      {!isGlobal && !isAnyLoading && !hasNoResultsInWantedScope && (
        <>
          <ResultsInScope scope={wantedScope} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
        </>
      )}
      {!isGlobal &&
        !isAnyLoading &&
        matchingScopeList
          .filter(scopeKey => scopeKey !== getKeyForScope(wantedScope))
          .map(getScopeForKey)
          .filter(scope => offerSearchResultsFromDifferentParatimes || scope.layer === wantedScope.layer)
          .map(scope => (
            <ResultsInOtherScopesThemed
              key={scope.key}
              scope={scope}
              searchQueries={searchQueries}
              numberOfResults={resultsInScopes[scope.key]}
              roseFiatValue={roseFiatValue}
              openByDefault={scope.network === Network.mainnet && !hasNoResultsInWantedScope}
              alsoHasLocalResults={!hasNoResultsInWantedScope}
            />
          ))}

      {isGlobal &&
        !isAnyLoading &&
        allScopes
          .filter(scopeKey => resultsInScopes[scopeKey])
          .map(getScopeForKey)
          .map(scope => (
            <ResultsInScopeThemed
              key={scope.key}
              scope={scope}
              searchQueries={searchQueries}
              roseFiatValue={roseFiatValue}
            />
          ))}
    </PageLayout>
  )
}
