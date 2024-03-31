import { To, useSearchParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'
import { ComprehensivePaginationEngine } from './PaginationEngine'
import { List } from '../../../oasis-nexus/api'
import { TablePaginationProps } from './TablePagination'

type ClientSizePaginationParams<Item> = {
  /**
   * How should we call the query parameter (in the URL)?
   */
  paramName: string

  /**
   * The pagination page size from the POV of the data consumer component
   */
  clientPageSize: number

  /**
   * The pagination page size used for actually loading the data from the server.
   *
   * Please note that currently this engine doesn't handle when the data consumer requires data which is not
   * part of the initial window on the server side.
   */
  serverPageSize: number

  /**
   * Transformation to be applied after loading the data from the server, before presenting it to the data consumer component
   *
   * Can be used for filtering, ordering, etc
   */
  transform?: (input: Item[]) => Item[]
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

/**
 * The ClientSidePagination engine loads the data from the server with a big window in one go, for in-memory pagination
 */
export function useClientSidePagination<Item, QueryResult extends List>({
  paramName,
  clientPageSize,
  serverPageSize,
  transform,
}: ClientSizePaginationParams<Item>): ComprehensivePaginationEngine<Item, QueryResult> {
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

  // From the server, we always want to load the first batch of data, with the provided (big) window.
  // In theory, we could move this window as required, but currently this is not implemented.
  const selectedServerPage = 1

  // The query parameters that should be used for loading the data from the server
  const paramsForQuery = {
    offset: (selectedServerPage - 1) * serverPageSize,
    limit: serverPageSize,
  }

  return {
    selectedPageForClient: selectedClientPage,
    paramsForServer: paramsForQuery,
    getResults: (isLoading, queryResult, key) => {
      const data = queryResult // we want to get list of items out from the incoming results
        ? key // do we know where (in which field) to look?
          ? (queryResult[key] as Item[]) // If yes, just get out the data
          : findListIn<QueryResult, Item>(queryResult) // If no, we will try to guess
        : undefined

      // Apply the specified client-side transformation
      const filteredData = !!data && !!transform ? transform(data) : data

      // The data window from the POV of the data consumer component
      const offset = (selectedClientPage - 1) * clientPageSize
      const limit = clientPageSize
      const dataWindow = filteredData ? filteredData.slice(offset, offset + limit) : undefined

      // The control interface for the data consumer component (i.e. Table)
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
        isLoading,
      }
    },
  }
}
