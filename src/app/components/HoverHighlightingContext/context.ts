import { createContext } from 'react'

export interface HoverHighlightingContextInfo {
  shouldHighlight: (address: string) => boolean
  selectAddress: (value: string) => void
  releaseAddress: (value: string) => void
}

export const HoverHighlightingContext = createContext<HoverHighlightingContextInfo | null>(null)
