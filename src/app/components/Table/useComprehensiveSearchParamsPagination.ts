import { To, useSearchParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { ComprehensivePaginatedResults, ComprehensivePaginationEngine } from './PaginationEngine'
import { List } from '../../../oasis-nexus/api'
import { TablePaginationProps } from './TablePagination'

type Filter<Item> = (item: Item) => boolean

type ComprehensiveSearchParamsPaginationParams<Item> = {
  paramName: string
  pageSize: number

  /**
   * @deprecated this will mess up page size.
   *
   * Consider using client-side pagination instead.
   */
  filter?: Filter<Item> | undefined

  /**
   * @deprecated this will mess up page size.
   *
   * Consider using client-side pagination instead.
   */
  filters?: (Filter<Item> | undefined)[]
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
  filters,
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
    selectedPageForClient: selectedPage,
    paramsForServer: paramsForQuery,
    getResults: (isLoading, isFetched, queryResult, key): ComprehensivePaginatedResults<Item> => {
      const data = queryResult
        ? key
          ? (queryResult[key] as Item[])
          : findListIn<QueryResult, Item>(queryResult)
        : undefined

      // Select the filters to use. (filter field, filters field, drop undefined ones)
      const filtersToApply = [filter, ...(filters ?? [])].filter(f => !!f) as Filter<Item>[]

      // Apply the specified filtering
      const filteredData = data
        ? filtersToApply.reduce<Item[]>(
            (partiallyFiltered, nextFilter) => partiallyFiltered.filter(nextFilter),
            data,
          )
        : data

      const tableProps: TablePaginationProps = {
        selectedPage,
        linkToPage,
        totalCount: queryResult?.total_count,
        isTotalCountClipped: queryResult?.is_total_count_clipped,
        rowsPerPage: pageSize,
      }

      const isOnFirstPage = tableProps.selectedPage === 1
      const hasData = !!filteredData?.length
      const hasNoResultsOnSelectedPage = !isLoading && !isOnFirstPage && !hasData
      const hasNoResultsWhatsoever = !isLoading && !queryResult?.total_count
      const hasNoResultsBecauseOfFilters = !isLoading && !!data?.length && !filteredData?.length

      return {
        tablePaginationProps: tableProps,
        data: filteredData,
        isLoading,
        isFetched,
        hasData,
        isOnFirstPage,
        hasNoResultsOnSelectedPage,
        hasNoResultsWhatsoever,
        hasNoResultsBecauseOfFilters,
      }
    },
    // tableProps,
  }
}
