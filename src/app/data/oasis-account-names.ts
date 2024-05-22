import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import {
  Layer,
  useGetConsensusAccountsAddresses,
  useGetRuntimeAccountsAddresses,
} from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import {
  AccountData,
  AccountMap,
  AccountMetadata,
  AccountMetadataInfo,
  AccountNameSearchConsensusMatch,
  AccountNameSearchMatch,
  AccountNameSearchResults,
  AccountNameSearchRuntimeMatch,
} from './named-accounts'
import { hasTextMatch } from '../components/HighlightedText/text-matching'

const dataSources: Record<Network, Partial<Record<Layer, string>>> = {
  [Network.mainnet]: {
    [Layer.consensus]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/mainnet_consensus.json',
    [Layer.emerald]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/mainnet_paratime.json',
    [Layer.sapphire]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/mainnet_paratime.json',
  },
  [Network.testnet]: {
    [Layer.consensus]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/testnet_consensus.json',
    [Layer.emerald]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/testnet_paratime.json',
    [Layer.sapphire]:
      'https://raw.githubusercontent.com/oasisprotocol/nexus/main/account-names/testnet_paratime.json',
  },
}

const getOasisAccountsMetadata = async (network: Network, layer: Layer): Promise<AccountData> => {
  const url = dataSources[network][layer]
  if (!url) throw new Error('No data available for this layer')
  const response = await axios.get(url)
  if (response.status !== 200) throw new Error("Couldn't load names")
  if (!response.data) throw new Error("Couldn't load names")
  // console.log('Response data is', response.data)
  const map: AccountMap = new Map()
  const list: AccountMetadata[] = []
  Array.from(response.data).forEach((entry: any) => {
    const metadata: AccountMetadata = {
      address: entry.Address,
      name: entry.Name,
      description: entry.Description,
    }
    // Register the metadata in its native form
    list.push(metadata)
    map.set(metadata.address, metadata)
  })
  return {
    map,
    list,
  }
}

export const useOasisAccountsMetadata = (
  network: Network,
  layer: Layer,
  queryOptions: { enabled: boolean },
) => {
  return useQuery(['oasisAccounts', network, layer], () => getOasisAccountsMetadata(network, layer), {
    enabled: queryOptions.enabled,
    staleTime: Infinity,
  })
}

export const useOasisAccountMetadata = (
  network: Network,
  layer: Layer,
  address: string,
  queryOptions: { enabled: boolean },
): AccountMetadataInfo => {
  const { isLoading, isError, error, data: allData } = useOasisAccountsMetadata(network, layer, queryOptions)
  if (isError) {
    console.log('Failed to load Oasis account metadata', error)
  }
  return {
    metadata: allData?.map.get(address),
    isLoading,
    isError,
  }
}

export const useSearchForOasisAccountsByName = (
  network: Network,
  layer: Layer,
  nameFragment: string,
  queryOptions: { enabled: boolean },
): AccountNameSearchResults => {
  const {
    isLoading: isMetadataLoading,
    isError: isMetadataError,
    error: metadataError,
    data: namedAccounts,
  } = useOasisAccountsMetadata(network, layer, queryOptions)
  if (isMetadataError) {
    console.log('Failed to load Oasis account metadata', metadataError)
  }

  const textMatcher =
    nameFragment && queryOptions.enabled
      ? (account: AccountMetadata) => hasTextMatch(account.name, [nameFragment])
      : () => false

  const matches =
    namedAccounts?.list.filter(textMatcher).map(
      (account): AccountNameSearchMatch => ({
        network,
        layer,
        address: account.address,
      }),
    ) ?? []

  const consensusMatches = layer === Layer.consensus ? (matches as AccountNameSearchConsensusMatch[]) : []
  const runtimeMatches = layer === Layer.consensus ? [] : (matches as AccountNameSearchRuntimeMatch[])

  const {
    isLoading: areConsensusAccountsLoading,
    isError: areConsensusAccountsError,
    data: consensusResults,
  } = useGetConsensusAccountsAddresses(consensusMatches, {
    enabled: queryOptions.enabled && !isMetadataLoading && !isMetadataError,
  })

  const {
    isLoading: areRuntimeAccountsLoading,
    isError: areRuntimeAccountsError,
    data: runtimeResults,
  } = useGetRuntimeAccountsAddresses(runtimeMatches, {
    enabled: queryOptions.enabled && !isMetadataLoading && !isMetadataError,
  })

  return {
    isLoading: isMetadataLoading || areConsensusAccountsLoading || areRuntimeAccountsLoading,
    isError: isMetadataError || areConsensusAccountsError || areRuntimeAccountsError,
    results: [...consensusResults, ...runtimeResults],
  }
}
