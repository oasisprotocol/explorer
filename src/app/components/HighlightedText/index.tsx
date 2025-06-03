import * as React from 'react'
import { findTextMatches, NormalizerOptions, PositiveMatchInfo } from './text-matching'
import { FC, ReactNode } from 'react'
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

export type HighlightPattern = string[]

export const NoHighlights: HighlightPattern = []

interface HighlightedTextProps {
  /**
   * The text to display
   */
  text: string | undefined

  /**
   * The pattern to search for (and highlight)
   */
  pattern?: HighlightPattern

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
  pattern = NoHighlights,
  partsToHighlight,
  options = defaultHighlight,
}) => {
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
  let processedTasks = 0

  while (processedChars < text.length) {
    // Do we still have tasks?
    if (processedTasks < sortedMatches.length) {
      // Yes, there are more tasks
      const task = sortedMatches[processedTasks]
      if (task.startPos < processedChars) {
        // This task with collude
        processedTasks++ // just skip this task
      } else {
        // We use this task
        pieces.push(text.substring(processedChars, task.startPos))
        const focus = text.substring(task.startPos, task.endPos)
        pieces.push(
          <Box key={processedTasks} component="mark" sx={sx}>
            {focus}
          </Box>,
        )
        processedChars = task.endPos
      }
    } else {
      // No more tasks, just grab the remaining string
      pieces.push(text.substring(processedChars))
      processedChars = text.length
    }
  }

  return <span style={{ textWrap: 'nowrap' }}>{pieces}</span>
}
