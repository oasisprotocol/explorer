import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
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

const DATA_SOURCE_URL = 'https://raw.githubusercontent.com/deltaDAO/mvg-portal/main/pontusxAddresses.json'

const getPontusXAccountsMetadata = async () => {
  const response = await axios.get(DATA_SOURCE_URL)
  if (response.status !== 200) throw new Error("Couldn't load names")
  if (!response.data) throw new Error("Couldn't load names")
  const map: AccountMap = new Map()
  const list: AccountMetadata[] = []
  Object.entries(response.data).forEach(([evmAddress, name]) => {
    const account: AccountMetadata = {
      address: getOasisAddress(evmAddress),
      name: name as string,
    }
    map.set(evmAddress, account)
    list.push(account)
  })
  return {
    map,
    list,
  }
}

export const usePontusXAccountsMetadata = (queryOptions: {
  enabled: boolean
  useErrorBoundary?: boolean
}) => {
  return useQuery(['pontusXNames'], getPontusXAccountsMetadata, {
    enabled: queryOptions.enabled,
    staleTime: Infinity,
    useErrorBoundary: queryOptions.useErrorBoundary,
  })
}

export const usePontusXAccountMetadata = (
  address: string,
  queryOptions: { enabled: boolean; useErrorBoundary?: boolean },
): AccountMetadataInfo => {
  const { isLoading, isError, error, data: allData } = usePontusXAccountsMetadata(queryOptions)
  if (isError) {
    console.log('Failed to load Pontus-X account names', error)
  }
  return {
    metadata: allData?.map.get(address),
    isLoading,
    isError,
  }
}

export const useSearchForPontusXAccountsByName = (
  network: Network,
  nameFragment: string,
  queryOptions: { enabled: boolean },
): AccountNameSearchRuntimeResults => {
  const {
    isLoading: isMetadataLoading,
    isError: isMetadataError,
    error: metadataError,
    data: namedAccounts,
  } = usePontusXAccountsMetadata({ ...queryOptions, useErrorBoundary: false })
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
            layer: Layer.pontusx,
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
