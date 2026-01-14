import { FC, ReactNode, useState } from 'react'
import { HoverHighlightingContext } from './context'
import { getEvmBech32Address, isValidEthAddress } from '../../utils/helpers'

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
