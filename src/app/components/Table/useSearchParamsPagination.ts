import { To, useSearchParams } from 'react-router-dom'

interface PaginationStatusCore {
  valid: boolean
}

interface InvalidPaginationStatus extends PaginationStatusCore {
  valid: false
}

interface ValidPaginationStatus extends PaginationStatusCore {
  valid: true
  selectedPage: number
  linkToPage: (page: number) => To
}

export type PaginationStatus = ValidPaginationStatus | InvalidPaginationStatus

export function useSearchParamsPagination(paramName: string): PaginationStatus {
  const [searchParams] = useSearchParams()
  const selectedPageString = searchParams.get(paramName)
  const selectedPage = parseInt(selectedPageString ?? '1', 10)
  if (isNaN(selectedPage) || (!!selectedPageString && selectedPage.toString() !== selectedPageString)) {
    return { valid: false }
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

  return { valid: true, selectedPage, linkToPage }
}
