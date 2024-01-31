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
export interface PaginatedResults<Item> {
  /**
   * Control interface that can be plugged to a Table's `pagination` prop
   */
  tablePaginationProps: TablePaginationProps

  /**
   * The data provided to the data consumer in the current window
   */
  data: Item[] | undefined
}

/**
 * A Comprehensive PaginationEngine sits between the server and the consumer of the data and does transformations
 *
 * Specifically, the interface for loading the data and the one for the data consumers are decoupled.
 */
export interface ComprehensivePaginationEngine<Item, QueryResult extends List> {
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
   * @param queryResult the data coming in the server, requested according to this engine's specs, including metadata
   * @param key The field where the actual records can be found within queryResults
   */
  getResults: (queryResult: QueryResult | undefined, key?: keyof QueryResult) => PaginatedResults<Item>
}
