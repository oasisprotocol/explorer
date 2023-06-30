import { Layer, useGetRuntimeEvmTokensAddress } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'

export const useTokenInfo = (scope: SearchScope, address: string) => {
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeEvmTokensAddress(network, layer, address!)
  const token = query.data?.data
  const { isLoading, isError, isFetched } = query
  return { token, isLoading, isError, isFetched }
}
