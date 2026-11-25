import { useGetConsensusValidators, useGetConsensusAccountsAddresses } from 'oasis-nexus/api'
import { Network } from 'types/network'
import { ValidatorAccountSearchResults } from '../data/named-accounts'

export const useSearchForValidatorsByEntityOrNodeId = (
  network: Network,
  entityId?: string,
): ValidatorAccountSearchResults => {
  const { isLoading, isError, data } = useGetConsensusValidators(
    network,
    {
      id: entityId,
    },
    {
      query: {
        enabled: !!entityId,
      },
    },
  )

  const matches =
    data?.data?.validators.map(validator => ({
      address: validator.entity_address,
      network,
    })) || []

  const {
    isLoading: areConsensusAccountsLoading,
    isError: areConsensusAccountsError,
    data: consensusResults,
  } = useGetConsensusAccountsAddresses(matches, {
    enabled: !isLoading && !isError,
  })

  return {
    isLoading: isLoading || areConsensusAccountsLoading,
    isError: isError || areConsensusAccountsError,
    results: consensusResults,
  }
}
