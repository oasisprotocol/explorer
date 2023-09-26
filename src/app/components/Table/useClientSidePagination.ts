import { To, useSearchParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { ComprehensivePaginationEngine } from './PaginationEngine'
import { List } from '../../../oasis-nexus/api'
import { TablePaginationProps } from './TablePagination'

type ClientSizePaginationParams<Item> = {
  paramName: string
  clientPageSize: number
  serverPageSize: number
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

export function useClientSidePagination<Item, QueryResult extends List>({
  paramName,
  clientPageSize,
  serverPageSize,
  filter,
}: ClientSizePaginationParams<Item>): ComprehensivePaginationEngine<Item, QueryResult> {
  const selectedServerPage = 1
  const [searchParams] = useSearchParams()
  const selectedClientPageString = searchParams.get(paramName)
  const selectedClientPage = parseInt(selectedClientPageString ?? '1', 10)
  if (
    isNaN(selectedClientPage) ||
    (!!selectedClientPageString && selectedClientPage.toString() !== selectedClientPageString)
  ) {
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

  const limit = serverPageSize
  const offset = (selectedServerPage - 1) * clientPageSize
  const paramsForQuery = {
    offset,
    limit,
  }

  return {
    selectedPage: selectedClientPage,
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

      const offset = (selectedClientPage - 1) * clientPageSize
      const limit = clientPageSize
      const dataWindow = filteredData ? filteredData.slice(offset, offset + limit) : undefined

      const tableProps: TablePaginationProps = {
        selectedPage: selectedClientPage,
        linkToPage,
        totalCount: filteredData
          ? // This correction is here to simulate the bogus behavior of server-side pagination
            // Remove this when server-side pagination is fixed,
            // and so the work-around in the pagination widget is fixed.
            filteredData.length - clientPageSize * (selectedClientPage - 1)
          : undefined,
        isTotalCountClipped: queryResult?.is_total_count_clipped, // TODO
        rowsPerPage: clientPageSize,
      }
      return {
        tablePaginationProps: tableProps,
        data: dataWindow,
      }
    },
    // tableProps,
  }
}
