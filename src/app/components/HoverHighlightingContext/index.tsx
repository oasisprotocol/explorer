import { createContext, FC, ReactNode, useContext, useState } from 'react'

interface HoverHighlightingContextInfo {
  readonly highlightedAddress: string | undefined
  highlightAddress: (value: string) => void
  releaseAddress: (value: string) => void
}

const HoverHighlightingContext = createContext<HoverHighlightingContextInfo | null>(null)

const noContext: HoverHighlightingContextInfo = {
  highlightedAddress: undefined,
  highlightAddress: () => {},
  releaseAddress: () => {},
}

export const HoverHighlightingContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>()
  const releaseAddress = (oldAddress: string) => {
    if (address === oldAddress) setAddress(undefined)
  }
  return (
    <HoverHighlightingContext.Provider
      value={{
        highlightedAddress: address,
        highlightAddress: setAddress,
        releaseAddress,
      }}
    >
      {children}
    </HoverHighlightingContext.Provider>
  )
}

export const useHoverHighlighting = () => {
  const context = useContext(HoverHighlightingContext)
  if (!context) {
    console.log('Warning: highlighting context is not provided!')
    return noContext
  }
  return context
}
