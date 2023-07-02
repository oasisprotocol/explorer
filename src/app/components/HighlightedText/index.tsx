import * as React from 'react'
import { findTextMatch, NormalizerOptions } from './text-matching'
import { FC } from 'react'
import { SxProps } from '@mui/material/styles'
import Box from '@mui/material/Box'

export interface HighlightOptions {
  /**
   * Options for identifying the matches
   */
  findOptions?: NormalizerOptions

  /**
   * Which class to use for highlighting?
   *
   * Please don't supply both class and style together.
   */
  className?: string

  /**
   * Which styles to use for highlighting?
   *
   * Please don't supply both class and style together.
   */
  sx?: SxProps
}

const defaultHighlight: HighlightOptions = {
  sx: {
    color: 'red',
  },
}

interface HighlightedTextProps {
  /**
   * The text to display
   */
  text: string | undefined

  /**
   * The pattern to search for (and highlight)
   */
  pattern: string | undefined

  /**
   * Optional: what class name to put on the highlighter SPAN?
   */
  options?: HighlightOptions
}

/**
 * Display a text, with potential pattern matches highlighted with html SPANs
 */
export const HighlightedText: FC<HighlightedTextProps> = ({ text, pattern, options = defaultHighlight }) => {
  const match = findTextMatch(text, [pattern])
  const {
    // className,
    sx,
  } = options

  return text === undefined ? undefined : match ? (
    <>
      {text.substring(0, match.startPos)}
      <Box display={'inline'} sx={sx}>
        {text.substring(match.startPos, match.startPos + match.searchText.length)}
      </Box>
      {text.substring(match.startPos + match.searchText.length)}
    </>
  ) : (
    text
  )
}
