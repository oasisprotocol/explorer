import { To } from 'react-router-dom'
import { TablePaginationProps } from './TablePagination'
import { List } from '../../../oasis-nexus/api'

export interface SimplePaginationEngine {
  selectedPage: number
  linkToPage: (pageNumber: number) => To
}

/**
 * The data returned by a comprehensive pagination engine to the data consumer component
 */
export interface ComprehensivePaginatedResults<Item, ExtractedData = typeof undefined> {
  /**
   * Control interface that can be plugged to a Table's `pagination` prop
   */
  tablePaginationProps: TablePaginationProps

  /**
   * The data provided to the data consumer in the current window
   */
  data: Item[] | undefined

  /**
   * Any extra data produced by the transformer function (besides the array of items)
   */
  extractedData?: ExtractedData | undefined

  /**
   * Is the data set still loading from the server?
   */
  isLoading: boolean

  /**
   * Has the data been loaded from the server?
   */
  isFetched: boolean

  /**
   * Are we on the first page of the pagination?
   */
  isOnFirstPage: boolean

  /**
   * Do we have any data on the client page?
   */
  hasData: boolean

  /**
   * Can we say that there are no results at all?
   *
   * This is determined before any filtering or transformation.
   */
  hasNoResultsWhatsoever: boolean

  /**
   * Can we say that there are no results on the selected page
   *
   * This will only be marked as true if
   *  - we are not the first page
   *  - loading has finished
   */
  hasNoResultsOnSelectedPage: boolean

  hasNoResultsBecauseOfFilters: boolean
}

/**
 * A Comprehensive PaginationEngine sits between the server and the consumer of the data and does transformations
 *
 * Specifically, the interface for loading the data and the one for the data consumers are decoupled.
 */
export interface ComprehensivePaginationEngine<
  Item,
  QueryResult extends List,
  ExtractedData = typeof undefined,
> {
  /**
   * The currently selected page from the data consumer's POV
   */
  selectedPageForClient: number

  /**
   * Parameters for data to be loaded from the server
   */
  paramsForServer: { offset: number; limit: number }

  /**
   * Get the current data/state info for the data consumer component.
   *
   * @param isLoading Is the data still being loaded from the server?
   * @param queryResult the data coming in the server, requested according to this engine's specs, including metadata
   * @param key The field where the actual records can be found within queryResults
   */
  getResults: (
    isLoading: boolean,
    isFetched: boolean,
    queryResult: QueryResult | undefined,
    key?: keyof QueryResult,
  ) => ComprehensivePaginatedResults<Item, ExtractedData>
}
