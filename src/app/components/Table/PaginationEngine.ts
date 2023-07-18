import { To } from 'react-router-dom'
import { TablePaginationProps } from './TablePagination'
import { List } from '../../../oasis-nexus/api'

export interface SimplePaginationEngine {
  selectedPage: number
  linkToPage: (pageNumber: number) => To
}

export interface PaginatedResults<Item> {
  tablePaginationProps: TablePaginationProps
  data: Item[] | undefined
}

export interface ComprehensivePaginationEngine<Item, QueryResult extends List> {
  selectedPage: number
  offsetForQuery: number
  limitForQuery: number
  paramsForQuery: { offset: number; limit: number }
  getResults: (queryResult: QueryResult | undefined, key?: keyof QueryResult) => PaginatedResults<Item>
}
