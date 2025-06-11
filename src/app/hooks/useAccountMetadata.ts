import { RuntimeScope, SearchScope } from '../../types/searchScope'
import { usePontusXAccountMetadata, useSearchForPontusXAccountsByName } from '../data/pontusx-account-names'
import { AccountMetadataInfo, AccountNameSearchResults } from '../data/named-accounts'
import { useOasisAccountMetadata, useSearchForOasisAccountsByName } from '../data/oasis-account-names'
import { getOasisAddress } from '../utils/helpers'
import { isLocalnet } from '../utils/route-utils'
import { useTokenInfo } from '../pages/TokenDashboardPage/hook'

/**
 * Find out the metadata for an account
 *
 * This is the entry point that should be used by the application,
 * since this function also includes caching.
 *
 * Doesn't throw if it fails.
 */
export const useAccountMetadata = (scope: SearchScope, address: string): AccountMetadataInfo => {
  // Look up metadata specified by us
  const isPontusX = scope.layer === 'pontusxtest' || scope.layer === 'pontusxdev'
  const pontusXData = usePontusXAccountMetadata(getOasisAddress(address), {
    enabled: isPontusX,
    useErrorBoundary: false,
  })
  const oasisData = useOasisAccountMetadata(scope.network, scope.layer, getOasisAddress(address), {
    enabled: !isLocalnet(scope.network),
    useErrorBoundary: false,
  })
  const registryData = isPontusX ? (pontusXData?.metadata ? pontusXData : oasisData) : oasisData

  // Also look up self-professed metadata (for tokens)
  const {
    token,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useTokenInfo(scope as RuntimeScope, address, {
    // The type cast is OK because whenever we are on consensus, we will set enabled to false
    enabled: !registryData?.metadata && scope.layer !== 'consensus',
    useCaching: true,
  })
  const tokenData: AccountMetadataInfo = {
    metadata: token ? { address: token.contract_addr, name: token.name, source: 'SelfProfessed' } : undefined,
    isLoading: isTokenLoading,
    isError: isTokenError,
  }

  return registryData?.metadata ? registryData : tokenData
}

/** Doesn't throw if it fails. */
export const useSearchForAccountsByName = (
  scope: SearchScope,
  nameFragments: string[],
): AccountNameSearchResults => {
  const isPontusX = scope.layer === 'pontusxtest' || scope.layer === 'pontusxdev'
  const isValidPontusXSearch = isPontusX && !!nameFragments.length
  const pontusXResults = useSearchForPontusXAccountsByName(scope.network, nameFragments, {
    enabled: isValidPontusXSearch,
    useErrorBoundary: false,
  })
  const isValidOasisSearch = !isPontusX && !!nameFragments.length
  const oasisResults = useSearchForOasisAccountsByName(scope.network, scope.layer, nameFragments, {
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
