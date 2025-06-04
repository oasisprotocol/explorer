import axios from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
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
import { hasTextMatchesForAll } from '../components/HighlightedText/text-matching'
import * as externalLinks from '../utils/externalLinks'
import { getOasisAddress } from '../utils/helpers'
import { isUrlSafe } from '../utils/url'

const dataSources: Record<Network, Partial<Record<Layer, string>>> = {
  [Network.mainnet]: {
    consensus: externalLinks.api.oasis_named_addresses_mainnet_consensus,
    emerald: externalLinks.api.oasis_named_addresses_mainnet_emerald,
    sapphire: externalLinks.api.oasis_named_addresses_mainnet_sapphire,
  },
  [Network.testnet]: {
    consensus: externalLinks.api.oasis_named_addresses_testnet_consensus,
    emerald: externalLinks.api.oasis_named_addresses_testnet_emerald,
    sapphire: externalLinks.api.oasis_named_addresses_testnet_sapphire,
    pontusxdev: externalLinks.api.oasis_named_addresses_testnet_pontusxdev,
    pontusxtest: externalLinks.api.oasis_named_addresses_testnet_pontusxtest,
  },
  [Network.localnet]: {
    consensus: undefined,
    emerald: undefined,
    sapphire: undefined,
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
      source: 'OasisRegistry',
      address: getOasisAddress(entry.Address),
      name: entry.Name,
      description: entry.Description,
      origin: entry.Origin,
      icon: entry.Icon && isUrlSafe(entry.Icon) ? entry.Icon : undefined,
      dapp:
        entry.Dapp && isUrlSafe(entry.Dapp.Url)
          ? {
              button: entry.Dapp.Button,
              description: entry.Dapp.Description,
              url: entry.Dapp.Url,
            }
          : undefined,
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

const useOasisAccountsMetadata = (
  network: Network,
  layer: Layer,
  queryOptions: UseQueryOptions<AccountData, unknown, AccountData, string[]>,
) => {
  return useQuery(['oasisAccounts', network, layer], () => getOasisAccountsMetadata(network, layer), {
    staleTime: Infinity,
    ...queryOptions,
  })
}

export const useOasisAccountMetadata = (
  network: Network,
  layer: Layer,
  oasisAddress: string,
  queryOptions: UseQueryOptions<AccountData, unknown, AccountData, string[]>,
): AccountMetadataInfo => {
  const { isLoading, isError, error, data: allData } = useOasisAccountsMetadata(network, layer, queryOptions)
  if (isError) {
    console.log('Failed to load Oasis account metadata', error)
  }
  return {
    metadata: allData?.map.get(oasisAddress),
    isLoading,
    isError,
  }
}

export const useSearchForOasisAccountsByName = (
  network: Network,
  layer: Layer,
  nameFragments: string[],
  queryOptions: { enabled: boolean } & UseQueryOptions<AccountData, unknown, AccountData, string[]>,
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

  const matches =
    !isMetadataLoading && nameFragments.length && queryOptions.enabled && namedAccounts
      ? namedAccounts.list
          .filter(account => hasTextMatchesForAll(account.name, nameFragments))
          .map(
            (account): AccountNameSearchMatch => ({
              network,
              layer,
              address: account.address,
            }),
          )
      : []

  const consensusMatches = layer === 'consensus' ? (matches as AccountNameSearchConsensusMatch[]) : []
  const runtimeMatches = layer === 'consensus' ? [] : (matches as AccountNameSearchRuntimeMatch[])

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
