import axios from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  AccountMetadata,
  AccountMap,
  AccountMetadataInfo,
  AccountNameSearchRuntimeMatch,
  AccountNameSearchRuntimeResults,
} from './named-accounts'
import { Layer, useGetRuntimeAccountsAddresses } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { hasTextMatch } from '../components/HighlightedText/text-matching'
import { getOasisAddress } from '../utils/helpers'
import * as externalLinks from '../utils/externalLinks'

type PontusXAccountsMetadata = {
  map: AccountMap
  list: AccountMetadata[]
}

const getPontusXAccountsMetadata = async (): Promise<PontusXAccountsMetadata> => {
  const response = await axios.get(externalLinks.api.deltadao_named_addresses)
  if (response.status !== 200) throw new Error("Couldn't load names")
  if (!response.data) throw new Error("Couldn't load names")
  const map: AccountMap = new Map()
  const list: AccountMetadata[] = []
  Object.entries(response.data).forEach(([evmAddress, name]) => {
    const account: AccountMetadata = {
      source: 'DeltaDaoRegistry',
      address: getOasisAddress(evmAddress),
      name: name as string,
    }
    map.set(account.address, account)
    list.push(account)
  })
  return {
    map,
    list,
  }
}

export const usePontusXAccountsMetadata = (
  queryOptions: UseQueryOptions<PontusXAccountsMetadata, unknown, PontusXAccountsMetadata, string[]>,
) => {
  return useQuery(['pontusXNames'], getPontusXAccountsMetadata, {
    staleTime: Infinity,
    ...queryOptions,
  })
}

export const usePontusXAccountMetadata = (
  oasisAddress: string,
  queryOptions: UseQueryOptions<PontusXAccountsMetadata, unknown, PontusXAccountsMetadata, string[]>,
): AccountMetadataInfo => {
  const { isLoading, isError, error, data: allData } = usePontusXAccountsMetadata(queryOptions)
  if (isError) {
    console.log('Failed to load Pontus-X account names', error)
  }
  return {
    metadata: allData?.map.get(oasisAddress),
    isLoading,
    isError,
  }
}

export const useSearchForPontusXAccountsByName = (
  network: Network,
  nameFragment: string,
  queryOptions: { enabled: boolean } & UseQueryOptions<
    PontusXAccountsMetadata,
    unknown,
    PontusXAccountsMetadata,
    string[]
  >,
): AccountNameSearchRuntimeResults => {
  const {
    isLoading: isMetadataLoading,
    isError: isMetadataError,
    error: metadataError,
    data: namedAccounts,
  } = usePontusXAccountsMetadata(queryOptions)
  if (isMetadataError) {
    console.log('Failed to load Pontus-X account names', metadataError)
  }

  const textMatcher =
    nameFragment && queryOptions.enabled
      ? (account: AccountMetadata) => hasTextMatch(account.name, [nameFragment])
      : () => false

  const matches =
    isMetadataLoading || isMetadataLoading
      ? undefined
      : namedAccounts?.list.filter(textMatcher).map(
          (account): AccountNameSearchRuntimeMatch => ({
            network,
            layer: Layer.pontusxtest,
            address: account.address,
          }),
        )

  const {
    isLoading: areAccountsLoading,
    isError: areAccountsError,
    data: results,
  } = useGetRuntimeAccountsAddresses(matches, {
    enabled: queryOptions.enabled && !isMetadataLoading && !isMetadataError,
  })

  return {
    isLoading: isMetadataLoading || areAccountsLoading,
    isError: isMetadataError || areAccountsError,
    results,
  }
}
