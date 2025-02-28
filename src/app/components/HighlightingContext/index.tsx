import { createContext, FC, ReactNode, useContext, useState } from 'react'

interface HighlightingContextInfo {
  readonly highlightedAddress: string | undefined
  highlightAddress: (value: string) => void
  releaseAddress: (value: string) => void
}

const HighlightingContext = createContext<HighlightingContextInfo | null>(null)

const noContext: HighlightingContextInfo = {
  highlightedAddress: undefined,
  highlightAddress: () => {},
  releaseAddress: () => {},
}

export const HighlightingContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>()
  const releaseAddress = (oldAddress: string) => {
    if (address === oldAddress) setAddress(undefined)
  }
  return (
    <HighlightingContext.Provider
      value={{
        highlightedAddress: address,
        highlightAddress: setAddress,
        releaseAddress,
      }}
    >
      {children}
    </HighlightingContext.Provider>
  )
}

export const useAddressHighlighting = () => {
  const context = useContext(HighlightingContext)
  if (!context) {
    console.log('Warning: highlighting context is not provided!')
    return noContext
  }
  return context
}
