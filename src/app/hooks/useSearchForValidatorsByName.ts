import { hasTextMatch } from 'app/components/HighlightedText/text-matching'
import {
  Layer,
  useGetConsensusValidatorsAddressNameMap,
  useGetConsensusAccountsAddresses,
  ValidatorAddressNameMap,
} from 'oasis-nexus/api'
import { Network } from 'types/network'
import { AccountNameSearchResults, AccountNameSearchConsensusMatch } from '../data/named-accounts'

function findAddressesWithMatch(addressMap: ValidatorAddressNameMap, nameFragment: string, network: Network) {
  const matchedAddresses: AccountNameSearchConsensusMatch[] = []

  for (const [address, name] of Object.entries(addressMap)) {
    if (hasTextMatch(name, [nameFragment])) {
      matchedAddresses.push({ address, layer: Layer.consensus, network })
    }
  }

  return matchedAddresses
}

export const useSearchForValidatorsByName = (
  network: Network,
  nameFragment: string | undefined,
): AccountNameSearchResults => {
  const { isLoading, isError, data } = useGetConsensusValidatorsAddressNameMap(network)
  const matches = data?.data && nameFragment ? findAddressesWithMatch(data?.data, nameFragment, network) : []
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
    results: [...consensusResults],
  }
}
