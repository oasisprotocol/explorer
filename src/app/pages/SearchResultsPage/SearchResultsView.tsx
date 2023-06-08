import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { SearchScope } from '../../../types/searchScope'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { SearchResults } from './hooks'
import { GlobalSearchResultsView } from './GlobalSearchResultsView'
import { ScopedSearchResultsView } from './ScopedSearchResultsView'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { getFilterForLayer } from '../../../types/layers'

export const SearchResultsView: FC<{
  wantedScope?: SearchScope
  searchResults: SearchResults
  isLoading: boolean
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchResults, isLoading, tokenPrices }) => {
  return (
    <PageLayout>
      <Divider variant="layout" />
      {isLoading ? (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      ) : wantedScope ? (
        <ScopedSearchResultsView
          wantedScope={wantedScope}
          searchResults={searchResults.filter(getFilterForLayer(wantedScope.layer))}
          tokenPrices={tokenPrices}
        />
      ) : (
        <GlobalSearchResultsView searchResults={searchResults} tokenPrices={tokenPrices} />
      )}
    </PageLayout>
  )
}
