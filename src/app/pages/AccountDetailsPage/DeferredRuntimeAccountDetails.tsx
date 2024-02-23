import { FC } from 'react'
import { Runtime, useGetRuntimeAccountsAddress } from '../../../oasis-nexus/api'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { AccountDetailsView } from './AccountDetailsView'
import { Network } from '../../../types/network'

/**
 * Load and display details of a RuntimeAccount
 */
export const DeferredRuntimeAccountDetails: FC<{
  network: Network
  layer: Runtime
  address: string
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}> = ({ network, layer, address, tokenPrices, showLayer }) => {
  const { data, isLoading, isError } = useGetRuntimeAccountsAddress(network, layer, address)
  return (
    <AccountDetailsView
      isLoading={isLoading}
      isError={isError}
      account={data?.data}
      tokenPrices={tokenPrices}
      showLayer={showLayer}
    />
  )
}
