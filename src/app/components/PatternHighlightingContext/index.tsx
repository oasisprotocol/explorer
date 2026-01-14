import { FC, ReactNode } from 'react'
import { PatternHighlightingContext } from './context'
import { HighlightPattern } from '../HighlightedText'
import { useHighlightPattern } from './hooks'

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
