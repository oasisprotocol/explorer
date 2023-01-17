import { To, useSearchParams } from 'react-router-dom'

export function useSearchParamsPagination(paramName: string) {
  const [searchParams] = useSearchParams()
  const selectedPage = parseInt(searchParams.get(paramName) ?? '1', 10)

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
