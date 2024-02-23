import { SearchScope } from '../../types/searchScope'
import Chance from 'chance'
import { Layer } from '../../oasis-nexus/api'
import { usePontusXAccountName } from '../data/pontusx-account-names'

const NO_MATCH = '__no_match__'

export type AccountNameInfo = {
  name: string | undefined
  loading: boolean
}

/**
 * Do we want to see some random names?
 */
const DEBUG_MODE = true

/**
 * Look up the name of an account.
 */
const lookupName = (scope: SearchScope, _address: string): string | undefined => {
  switch (scope.layer) {
    // TODO: look up the data
    default:
      // If debug mode is on, return mock names in ~50% of the cases, no nome otherwise
      return DEBUG_MODE && Math.random() < 0.5 ? new Chance().name() : undefined
  }
}

const nameCache: Map<string, string> = new Map<string, string>()

/**
 * Find out the name of an account
 *
 * This is the entry point that should be used by the application,
 * since this function also includes caching.
 */
export const useAccountName = (scope: SearchScope, address: string, dropCache = false): AccountNameInfo => {
  const isPontusX = scope.layer === Layer.pontusx

  const pontusXName = usePontusXAccountName(address, isPontusX)
  if (isPontusX) return pontusXName

  const key = `${scope.network}.${scope.layer}.${address}`

  if (dropCache) nameCache.delete(key)
  const hasMatch = nameCache.has(key)
  if (hasMatch) {
    const cachedName = nameCache.get(key)
    return {
      name: cachedName === NO_MATCH ? undefined : cachedName,
      loading: false,
    }
  }
  const name = lookupName(scope, address)
  nameCache.set(key, name ?? NO_MATCH)
  return {
    name,
    loading: false,
  }
}
