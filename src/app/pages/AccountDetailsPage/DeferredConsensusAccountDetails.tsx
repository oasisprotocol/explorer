import { FC } from 'react'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { Network } from '../../../types/network'

/**
 * Load and display details of a RuntimeAccount
 */
export const DeferredConsensusAccountDetails: FC<{
  network: Network
  address: string
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}> = () =>
  // {
  // network, address, tokenPrices, highlightedPartOfName, showLayer
  // },
  {
    // TODO: load and display consensus account details when API and component becomes available
    return null
  }
