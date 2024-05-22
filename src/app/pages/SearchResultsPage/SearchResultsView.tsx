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
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchParams } from '../../components/Search/search-utils'

export const SearchResultsView: FC<{
  wantedScope?: SearchScope
  searchParams: SearchParams
  searchResults: SearchResults
  isLoading: boolean
  isPotentiallyIncomplete: boolean
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchParams, searchResults, isLoading, isPotentiallyIncomplete, tokenPrices }) => {
  const { isMobile } = useScreenSize()
  return (
    <PageLayout>
      {!isMobile && <Divider variant="layout" />}
      {isLoading ? (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      ) : wantedScope ? (
        <ScopedSearchResultsView
          wantedScope={wantedScope}
          searchParams={searchParams}
          searchResults={searchResults.filter(getFilterForLayer(wantedScope.layer))}
          isPotentiallyIncomplete={isPotentiallyIncomplete}
          tokenPrices={tokenPrices}
        />
      ) : (
        <GlobalSearchResultsView
          searchParams={searchParams}
          searchResults={searchResults}
          isPotentiallyIncomplete={isPotentiallyIncomplete}
          tokenPrices={tokenPrices}
        />
      )}
    </PageLayout>
  )
}
