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

export const SearchResultsView: FC<{
  wantedScope?: SearchScope
  searchTerm: string
  searchResults: SearchResults
  isLoading: boolean
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchTerm, searchResults, isLoading, tokenPrices }) => {
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
          searchTerm={searchTerm}
          searchResults={searchResults.filter(getFilterForLayer(wantedScope.layer))}
          tokenPrices={tokenPrices}
        />
      ) : (
        <GlobalSearchResultsView
          searchTerm={searchTerm}
          searchResults={searchResults}
          tokenPrices={tokenPrices}
        />
      )}
    </PageLayout>
  )
}
