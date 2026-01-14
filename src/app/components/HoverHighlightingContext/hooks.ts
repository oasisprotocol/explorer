import { useContext } from 'react'
import { HoverHighlightingContext, HoverHighlightingContextInfo } from './context'

const noContext: HoverHighlightingContextInfo = {
  shouldHighlight: () => false,
  selectAddress: () => {},
  releaseAddress: () => {},
}

export const useHoverHighlighting = () => {
  const context = useContext(HoverHighlightingContext)
  if (!context) {
    console.log('Warning: highlighting context is not provided!')
    return noContext
  }
  return context
}
