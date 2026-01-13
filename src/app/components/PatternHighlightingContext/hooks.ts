import { useContext } from 'react'
import { PatternHighlightingContext } from './context'
import { HighlightPattern } from '../HighlightedText'
import { parseMultiTermSearch, useParamSearch } from '../Search/search-utils'

export const useHighlightPattern = (): HighlightPattern => {
  // Get the application-wide search string
  const searchParams = useParamSearch()

  // See if we have any specific search patterns
  const pattern = useContext(PatternHighlightingContext)?.highlightPattern
  if (pattern) return pattern

  // Let's get patterns from search query
  const { query } = searchParams
  if (query) {
    return parseMultiTermSearch(query)
  }
  return []
}
