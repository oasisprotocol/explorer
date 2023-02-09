import { To, useSearchParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'

export function useSearchParamsPagination(paramName: string) {
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

  return { selectedPage, linkToPage }
}
