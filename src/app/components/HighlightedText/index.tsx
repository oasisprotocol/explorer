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

const defaultHighlightStyle: SxProps = {
  background: '#FFFF54',
  padding: '4px',
  margin: '-4px',
}

const defaultHighlight: HighlightOptions = {
  sx: defaultHighlightStyle,
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
   * Options for highlighting (case sensitivity, styling, etc.)
   *
   * (This is optional, sensible defaults are provided.)
   */
  options?: HighlightOptions
}

/**
 * Display a text, with potential pattern matches highlighted with html MARKs
 */
export const HighlightedText: FC<HighlightedTextProps> = ({ text, pattern, options = defaultHighlight }) => {
  const { sx = defaultHighlightStyle, findOptions = {} } = options
  const match = findTextMatch(text, [pattern], findOptions)

  return text === undefined ? undefined : match ? (
    <>
      {text.substring(0, match.startPos)}
      <Box component="mark" sx={sx}>
        {text.substring(match.startPos, match.startPos + match.searchText.length)}
      </Box>
      {text.substring(match.startPos + match.searchText.length)}
    </>
  ) : (
    text
  )
}
