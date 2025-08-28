import { createContext, FC, ReactNode, useContext, useState } from 'react'
import { getEvmBech32Address, isValidEthAddress } from '../../utils/helpers'

interface HoverHighlightingContextInfo {
  shouldHighlight: (address: string) => boolean
  selectAddress: (value: string) => void
  releaseAddress: (value: string) => void
}

const HoverHighlightingContext = createContext<HoverHighlightingContextInfo | null>(null)

const noContext: HoverHighlightingContextInfo = {
  shouldHighlight: () => false,
  selectAddress: () => {},
  releaseAddress: () => {},
}

/**
 * Convert highlight address to a uniform format:
 */
const normalizeAddress = (address: string) =>
  isValidEthAddress(address)
    ? getEvmBech32Address(address).toLowerCase() // We always want oasis address, not eth
    : address.toLowerCase() // wherever else this is, just lowercase it

export const HoverHighlightingContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const shouldHighlight = (address: string) =>
    !!selectedAddress && selectedAddress === normalizeAddress(address)
  const selectAddress = (address: string) => setSelectedAddress(normalizeAddress(address))
  const releaseAddress = (address: string) => {
    if (selectedAddress === normalizeAddress(address)) setSelectedAddress(undefined)
  }
  return (
    <HoverHighlightingContext.Provider
      value={{
        shouldHighlight,
        selectAddress,
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
