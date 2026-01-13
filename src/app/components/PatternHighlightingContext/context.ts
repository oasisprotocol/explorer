import { createContext } from 'react'
import { HighlightPattern } from '../HighlightedText'

export const PatternHighlightingContext = createContext<{
  readonly highlightPattern: HighlightPattern
} | null>(null)
