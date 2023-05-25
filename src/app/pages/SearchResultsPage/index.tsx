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
import { ResultsInScope } from './ResultsInScope'
import {
  SearchQueries,
  useBlocksConditionally,
  useRuntimeAccountConditionally,
  useTransactionsConditionally,
} from './hooks'
import { ResultsElsewhere } from './ResultsElsewhere'
import { ResultsInScopeThemed } from './ResultsInScopeThemed'
import { getKeyForScope, getNameForScope, getScopeForKey, SearchScope } from '../../../types/searchScope'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useTranslation } from 'react-i18next'
import { ResultListFrame } from './ResultsInNetworkThemed'
import { getThemesForNetworks } from '../../../styles/theme'

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
  const { t } = useTranslation()
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const allResults = Object.values(searchQueries).flatMap<HasScope>(query => query.results ?? [])

  const allScopes = RouteUtils.getEnabledSearchScopes().map(getKeyForScope)

  const resultsInScopes: Record<string, number> = {} as any

  if (!isAnyLoading) {
    allScopes.forEach(key => (resultsInScopes[key] = 0))
    allResults.forEach(result => resultsInScopes[getKeyForScope(result)]++)
  }

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
        <ResultListFrame theme={getThemesForNetworks()[wantedScope.network]}>
          <SubPageCard
            title={getNameForScope(t, wantedScope)}
            subheader={t('search.results.count', {
              count: resultsInScopes[getKeyForScope(wantedScope)],
            })}
          >
            <ResultsInScope scope={wantedScope} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
          </SubPageCard>
        </ResultListFrame>
      )}
      {!isGlobal && !isAnyLoading && (
        <ResultsElsewhere
          wantedScope={wantedScope}
          resultsInScopes={resultsInScopes}
          searchQueries={searchQueries}
          roseFiatValue={roseFiatValue}
        />
      )}

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
              numberOfResults={resultsInScopes[scope.key]}
              roseFiatValue={roseFiatValue}
            />
          ))}
    </PageLayout>
  )
}
