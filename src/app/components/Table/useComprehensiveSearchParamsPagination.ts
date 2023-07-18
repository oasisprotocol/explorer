import { To, useSearchParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { ComprehensivePaginationEngine } from './PaginationEngine'
import { List } from '../../../oasis-nexus/api'
import { TablePaginationProps } from './TablePagination'

type ComprehensiveSearchParamsPaginationParams<Item> = {
  paramName: string
  pageSize: number
  /**
   * @deprecated this will mess up page size.
   *
   * Consider using client-side pagination instead.
   */
  filter?: (item: Item) => boolean
}

const knownListKeys: string[] = ['total_count', 'is_total_count_clipped']

function findListIn<T extends List, Item>(data: T): Item[] {
  const candidates = Object.keys(data).filter(
    key => !knownListKeys.includes(key) && Array.isArray(data[key as keyof T]),
  ) as (keyof T)[]
  switch (candidates.length) {
    case 0:
      throw new Error('Data not found!')
    case 1:
      return data[candidates[0]] as Item[]
    default:
      throw new Error('Data not found!')
  }
}

export function useComprehensiveSearchParamsPagination<Item, QueryResult extends List>({
  paramName,
  pageSize,
  filter,
}: ComprehensiveSearchParamsPaginationParams<Item>): ComprehensivePaginationEngine<Item, QueryResult> {
  const [searchParams] = useSearchParams()
  const selectedPageString = searchParams.get(paramName)
  const selectedPage = parseInt(selectedPageString ?? '1', 10)
  if (isNaN(selectedPage) || (!!selectedPageString && selectedPage.toString() !== selectedPageString)) {
    // This would be nicer, but this would also trigger react-error-overlay (besides our error boundary).
    // We don't want that, so now, we are stuck with throwing a string, instead of a proper error.
    // throw new AppError(AppErrors.InvalidPageNumber)
    throw AppErrors.InvalidPageNumber
  }

  function linkToPage(page: number): To {
    const newSearchParams = new URLSearchParams(searchParams)
    if (page > 1) {
      newSearchParams.set(paramName, page.toString())
    } else {
      newSearchParams.delete(paramName)
    }
    return { search: newSearchParams.toString() }
  }

  const limit = pageSize
  const offset = (selectedPage - 1) * pageSize
  const paramsForQuery = {
    offset,
    limit,
  }

  return {
    selectedPage,
    offsetForQuery: offset,
    limitForQuery: limit,
    paramsForQuery,
    getResults: (queryResult, key) => {
      const data = queryResult
        ? key
          ? (queryResult[key] as Item[])
          : findListIn<QueryResult, Item>(queryResult)
        : undefined
      const filteredData = !!data && !!filter ? data.filter(filter) : data
      const tableProps: TablePaginationProps = {
        selectedPage,
        linkToPage,
        totalCount: queryResult?.total_count,
        isTotalCountClipped: queryResult?.is_total_count_clipped,
        rowsPerPage: pageSize,
      }
      return {
        tablePaginationProps: tableProps,
        data: filteredData,
      }
    },
    // tableProps,
  }
}
