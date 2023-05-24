import { FC } from 'react'
import { SearchQueries } from './hooks'
import { ResultsWithFilter } from './ResultsWithFilter'
import { Network } from '../../../types/network'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific network.
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsInNetwork: FC<{
  network: Network
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, roseFiatValue }) => (
  <ResultsWithFilter
    searchQueries={searchQueries}
    roseFiatValue={roseFiatValue}
    filter={item => item.network === network}
  />
)
