import { createContext, FC, ReactNode, useContext } from 'react'
import { HighlightPattern } from '../HighlightedText'
import { parseMultiTermSearch, useParamSearch } from '../Search/search-utils'

const PatternHighlightingContext = createContext<{ readonly highlightPattern: HighlightPattern } | null>(null)

export const WithHighlightPattern: FC<{
  children: ReactNode

  /**
   * Pattern for highlighting
   */
  pattern: HighlightPattern

  /**
   * Should this replace any previously set highlight pattern, for this subtree of the DOM?
   *
   * Defaults to false, so that this pattern is added to any existing pattern
   */
  replace?: boolean
}> = ({ children, pattern, replace = false }) => {
  const upstreamPatterns = useHighlightPattern()
  return (
    <PatternHighlightingContext.Provider
      value={{ highlightPattern: replace ? pattern : [...upstreamPatterns, ...pattern] }}
    >
      {children}
    </PatternHighlightingContext.Provider>
  )
}

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
