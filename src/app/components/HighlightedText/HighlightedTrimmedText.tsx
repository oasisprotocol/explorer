import { FC } from 'react'

import { HighlightedText, HighlightOptions } from './index'
import { trimAroundMatch } from './text-trimming'

type HighlightedTrimmedTextProps = {
  /**
   * The text to display
   */
  text: string | undefined

  /**
   * The pattern to search for (and highlight)
   */
  pattern: string | undefined

  /**
   * Options for highlighting (case sensitivity, styling, etc.)
   *
   * (This is optional, sensible defaults are provided.)
   */
  options?: HighlightOptions

  /**
   * What should be the length of the fragment delivered, which
   * has the pattern inside it?
   */
  fragmentLength: number
}

/**
 * Display a text with a part highlighted, trimmed to a specific length around the highlight
 */
export const HighlightedTrimmedText: FC<HighlightedTrimmedTextProps> = props => {
  const { text, pattern, fragmentLength, options } = props
  const { part, match } = trimAroundMatch(text, pattern, { fragmentLength })
  return <HighlightedText text={part} pattern={pattern} part={match} options={options} />
}
