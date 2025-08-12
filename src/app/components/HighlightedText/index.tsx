import * as React from 'react'
import { findTextMatches, NormalizerOptions, PositiveMatchInfo } from './text-matching'
import { FC, ReactNode } from 'react'
import { SxProps } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useHighlightPattern } from '../PatternHighlightingContext'

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

export type HighlightPattern = string[]

export const NoHighlights: HighlightPattern = []

interface HighlightedTextProps {
  /**
   * The text to display
   */
  text: string | undefined

  /**
   * Instructions about which part to highlight.
   *
   * If not given, we will just search for the pattern.
   * If given, this will be executed, and the pattern will not even be considered.
   */
  partsToHighlight?: PositiveMatchInfo[]

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
  partsToHighlight,
  options = defaultHighlight,
}) => {
  const pattern = useHighlightPattern()
  const { sx = defaultHighlightStyle, findOptions = {} } = options

  // Have we been told what to highlight exactly? If not, look for the pattern
  const matches = partsToHighlight ?? findTextMatches(text, pattern, findOptions)

  if (text === undefined) return undefined // Nothing to display
  if (!matches.length) return text // We don't have to highlight anything

  const sortedMatches = matches.sort((a, b) =>
    a.startPos > b.startPos ? 1 : a.startPos < b.startPos ? -1 : 0,
  )

  const pieces: ReactNode[] = []
  let processedChars = 0
  let processedMatches = 0

  while (processedChars < text.length) {
    // Do we still have matches to highlight?
    if (processedMatches < sortedMatches.length) {
      // Yes, there are more matches
      const match = sortedMatches[processedMatches]
      if (match.startPos < processedChars) {
        // This match would collude with something already highlighted
        processedMatches++ // just skip this match
      } else {
        // We want to highlight this match
        pieces.push(text.substring(processedChars, match.startPos))
        const focus = text.substring(match.startPos, match.endPos)
        pieces.push(
          <Box key={processedMatches} component="mark" sx={sx}>
            {focus}
          </Box>,
        )
        processedChars = match.endPos
      }
    } else {
      // No more matches, just grab the remaining string
      pieces.push(text.substring(processedChars))
      processedChars = text.length
    }
  }

  return <span style={{ textWrap: 'nowrap' }}>{pieces}</span>
}
