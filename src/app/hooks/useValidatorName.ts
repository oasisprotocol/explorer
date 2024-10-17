import { Network } from 'types/network'
import { useGetConsensusValidatorsAddressNameMap } from '../../oasis-nexus/api'

export const useValidatorName = (network: Network, address: string): string | undefined => {
  const { data } = useGetConsensusValidatorsAddressNameMap(network)
  const validatorName = data?.data?.[address]

  return validatorName
}
