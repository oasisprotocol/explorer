import { hasTextMatchesForAll } from 'app/components/HighlightedText/text-matching'
import {
  Layer,
  useGetConsensusValidatorsAddressNameMap,
  useGetConsensusAccountsAddresses,
  ValidatorAddressNameMap,
} from 'oasis-nexus/api'
import { Network } from 'types/network'
import { AccountNameSearchValidatorResults, AccountNameSearchConsensusMatch } from '../data/named-accounts'

function findAddressesWithMatch(
  addressMap: ValidatorAddressNameMap,
  nameFragments: string[],
  network: Network,
) {
  const matchedAddresses: AccountNameSearchConsensusMatch[] = []

  for (const [address, name] of Object.entries(addressMap)) {
    if (hasTextMatchesForAll(name, nameFragments)) {
      matchedAddresses.push({ address, layer: Layer.consensus, network })
    }
  }

  return matchedAddresses
}

export const useSearchForValidatorsByName = (
  network: Network,
  nameFragment: string[],
): AccountNameSearchValidatorResults => {
  const { isLoading, isError, data } = useGetConsensusValidatorsAddressNameMap(network)
  const matches =
    data?.data && !!nameFragment.length ? findAddressesWithMatch(data?.data, nameFragment, network) : []
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
