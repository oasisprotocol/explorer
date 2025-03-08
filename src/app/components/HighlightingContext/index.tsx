import { createContext, FC, ReactNode, useContext, useState } from 'react'

interface HighlightingContextInfo {
  readonly address: string | undefined
  setAddress: (value: string | undefined) => void
}

const HighlightingContext = createContext<HighlightingContextInfo | null>(null)

const noContext: HighlightingContextInfo = {
  address: undefined,
  setAddress: () => {},
}

export const HighlightingContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>()
  return (
    <HighlightingContext.Provider value={{ address, setAddress }}>{children}</HighlightingContext.Provider>
  )
}

export const useHighlighting = () => {
  const context = useContext(HighlightingContext)
  if (!context) {
    console.log('Warning: highlighting context is not provided!')
    return noContext
  }
  return context
}
