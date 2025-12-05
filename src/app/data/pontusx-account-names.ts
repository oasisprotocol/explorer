import { usePontusXRegistry } from '@deltadao/pontusx-registry-hooks'
import { UseQueryOptions } from '@tanstack/react-query'
import { useGetRuntimeAccountsAddresses } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { hasTextMatchesForAll } from '../components/HighlightedText/text-matching'
import { getOasisAddress } from '../utils/helpers'
import {
  AccountMap,
  AccountMetadata,
  AccountMetadataInfo,
  AccountNameSearchRuntimeMatch,
  AccountNameSearchRuntimeResults,
} from './named-accounts'

type PontusXAccountsMetadata = {
  map: AccountMap
  list: AccountMetadata[]
}

export const usePontusXAccountsMetadata = () => {
  const { isLoading, error, data } = usePontusXRegistry({
    apiBaseUrl: 'https://cache.registry.staging.pontus-x.eu',
    includeDeprecated: true,
  })

  if (error) {
    console.log('Failed to load Pontus-X account names', error)
  }

  const map: AccountMap = new Map()
  const list: AccountMetadata[] = []

  if (!data) {
    return { map, list, isLoading, error }
  }

  data.forEach(identity => {
    const account: AccountMetadata = {
      source: 'DeltaDaoRegistry',
      address: getOasisAddress(identity.walletAddress),
      name: identity.legalName as string,
    }
    map.set(account.address, account)
    list.push(account)
  })

  return { map, list, isLoading, error }
}

export const usePontusXAccountMetadata = (oasisAddress: string): AccountMetadataInfo => {
  const { map, isLoading, error } = usePontusXAccountsMetadata()

  return {
    metadata: map.get(oasisAddress),
    isLoading,
    isError: error !== undefined,
  }
}

export const useSearchForPontusXAccountsByName = (
  network: Network,
  nameFragments: string[],
  queryOptions: { enabled: boolean } & UseQueryOptions<
    PontusXAccountsMetadata,
    unknown,
    PontusXAccountsMetadata,
    string[]
  >,
): AccountNameSearchRuntimeResults => {
  const {
    isLoading: isMetadataLoading,
    error: metadataError,
    list: namedAccountsList,
  } = usePontusXAccountsMetadata()

  const isMetadataError = metadataError !== undefined

  if (isMetadataError) {
    console.log('Failed to load Pontus-X account names', metadataError)
  }

  const matches =
    isMetadataLoading || !nameFragments.length || !queryOptions.enabled
      ? undefined
      : namedAccountsList
          .filter(account => hasTextMatchesForAll(account.name, nameFragments))
          .map(
            (account): AccountNameSearchRuntimeMatch => ({
              network,
              layer: 'pontusxtest',
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
