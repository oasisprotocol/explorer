import { FC } from 'react'
import { SearchQueries } from './hooks'
import { SearchScope } from '../../../types/searchScope'
import { ResultsWithFilter } from './ResultsWithFilter'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific scope
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsInScope: FC<{
  scope: SearchScope
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ scope, searchQueries, roseFiatValue }) => (
  <ResultsWithFilter
    searchQueries={searchQueries}
    roseFiatValue={roseFiatValue}
    filter={Item => Item.network === scope.network && Item.layer === scope.layer}
  />
)
