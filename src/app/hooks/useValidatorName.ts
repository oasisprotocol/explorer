import { Network } from 'types/network'
import { useGetConsensusValidatorsAddressNameMap } from '../../oasis-nexus/api'

export const useValidatorName = (network: Network, address: string): string | undefined => {
  const { data } = useGetConsensusValidatorsAddressNameMap(
    network,
    {},
    {
      query: {
        staleTime: 5 * 60 * 1000, // Set cache time to 5 minutes
      },
    },
  )
  const validatorName = data?.data?.[address]

  return validatorName
}
