import { useEffect, useState } from 'react'
import { getEthAccountAddressFromBase64, getEvmBech32Address } from '../../utils/helpers'
import { Layer, useGetRuntimeEvmTokensAddress } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { AppErrors } from '../../../types/errors'

export const useTokenWithBase64Address = (scope: SearchScope, base64Address: string | undefined) => {
  const [oasisAddress, setOasisAddress] = useState('')
  const ethAddress = base64Address ? getEthAccountAddressFromBase64(base64Address) : undefined
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  useEffect(() => {
    if (ethAddress) {
      getEvmBech32Address(ethAddress).then(setOasisAddress)
    }
  }, [ethAddress])
  const { isLoading, isError, data } = useGetRuntimeEvmTokensAddress(network, layer, oasisAddress, {
    query: {
      enabled: !!oasisAddress,
    },
  })
  const token = data?.data
  return {
    ethAddress,
    oasisAddress,
    isLoading: !!base64Address && isLoading,
    isError,
    token,
  }
}
