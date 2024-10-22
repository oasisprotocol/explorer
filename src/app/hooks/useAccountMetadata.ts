import { SearchScope } from '../../types/searchScope'
import { Layer } from '../../oasis-nexus/api'
import { usePontusXAccountMetadata, useSearchForPontusXAccountsByName } from '../data/pontusx-account-names'
import { AccountMetadataInfo, AccountNameSearchResults } from '../data/named-accounts'
import { useOasisAccountMetadata, useSearchForOasisAccountsByName } from '../data/oasis-account-names'
import { getOasisAddress } from '../utils/helpers'

/**
 * Find out the metadata for an account
 *
 * This is the entry point that should be used by the application,
 * since this function also includes caching.
 *
 * Doesn't throw if it fails.
 */
export const useAccountMetadata = (scope: SearchScope, address: string): AccountMetadataInfo => {
  const isPontusX = scope.layer === Layer.pontusxtest || scope.layer === Layer.pontusxdev
  const pontusXData = usePontusXAccountMetadata(address, {
    enabled: isPontusX,
    useErrorBoundary: false,
  })
  const oasisData = useOasisAccountMetadata(scope.network, scope.layer, getOasisAddress(address), {
    enabled: !isPontusX,
    useErrorBoundary: false,
  })
  return isPontusX ? pontusXData : oasisData
}

/** Doesn't throw if it fails. */
export const useSearchForAccountsByName = (
  scope: SearchScope,
  nameFragment = '',
): AccountNameSearchResults => {
  const isPontusX = scope.layer === Layer.pontusxtest || scope.layer === Layer.pontusxdev
  const isValidPontusXSearch = isPontusX && !!nameFragment
  const pontusXResults = useSearchForPontusXAccountsByName(scope.network, nameFragment, {
    enabled: isValidPontusXSearch,
    useErrorBoundary: false,
  })
  const isValidOasisSearch = !isPontusX && !!nameFragment
  const oasisResults = useSearchForOasisAccountsByName(scope.network, scope.layer, nameFragment, {
    enabled: isValidOasisSearch,
    useErrorBoundary: false,
  })
  return {
    isLoading:
      (isValidPontusXSearch && pontusXResults.isLoading) || (isValidOasisSearch && oasisResults.isLoading),
    isError: (isValidPontusXSearch && pontusXResults.isError) || (isValidOasisSearch && oasisResults.isError),
    results: [...(pontusXResults.results ?? []), ...(oasisResults.results ?? [])],
  }
}
