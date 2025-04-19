import * as React from 'react'
import { MatchInfo, findTextMatch, NO_MATCH, NormalizerOptions } from './text-matching'
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
  background: '#FFFF5480',
  padding: '2px',
  margin: '-2px',
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
   * Instructions about which part to highlight.
   *
   * If not given, we will just search for the pattern.
   * If given, this will be executed, and the pattern will not even be considered.
   */
  part?: MatchInfo

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
export const HighlightedText: FC<HighlightedTextProps> = ({
  text,
  pattern,
  part,
  options = defaultHighlight,
}) => {
  const { sx = defaultHighlightStyle, findOptions = {} } = options

  // Have we been told what to highlight exactly? If not, look for the pattern
  const task = part ?? findTextMatch(text, [pattern], findOptions)

  if (text === undefined) return undefined // Nothing to display
  if (task === NO_MATCH) return <span>{text}</span> // We don't have to highlight anything

  const beginning = text.substring(0, task.startPos)
  const focus = text.substring(task.startPos, task.endPos)
  const end = text.substring(task.endPos)

  return (
    <span>
      {beginning}
      <Box component="mark" sx={sx}>
        {focus}
      </Box>
      {end}
    </span>
  )
}
