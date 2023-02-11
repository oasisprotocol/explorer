import {
  isValidBlockHeight,
  isValidBlockHash,
  isValidTxHash,
  isValidOasisAddress,
  isValidEthAddress,
} from '../../utils/helpers'
import { RouteUtils } from '../../utils/route-utils'

export abstract class SearchUtils {
  /**
   * Receives a search term and returns a matching path
   * @param searchTerm
   */
  static getNavigationPath(searchTerm: string): string {
    if (isValidBlockHeight(searchTerm)) {
      const blockNumber = parseInt(searchTerm, 10)
      return RouteUtils.getBlockRoute(blockNumber)
    }
    // TODO: Add address
    // TODO: Add contract
    // TODO: Txn hash
    // TODO: Transaction ID

    throw new Error('No known route matches your search term!')
  }
}

export const validateAndNormalize = {
  blockHeight: (searchTerm: string) => {
    if (isValidBlockHeight(searchTerm)) {
      return searchTerm
    }
  },
  blockHash: (searchTerm: string) => {
    if (isValidBlockHash(searchTerm.toLowerCase().replace('0x', ''))) {
      return searchTerm.toLowerCase().replace('0x', '')
    }
    if (isValidBlockHash(searchTerm.toLowerCase())) {
      return searchTerm.toLowerCase()
    }
  },

  // TODO: do we need to differentiate between consensus and evm hashes?
  // TODO: normalize to 0x prefix for evm?
  txHash: (searchTerm: string) => {
    if (isValidTxHash(searchTerm.toLowerCase().replace('0x', ''))) {
      return searchTerm.toLowerCase().replace('0x', '')
    }
    if (isValidTxHash(searchTerm.toLowerCase())) {
      return searchTerm.toLowerCase()
    }
  },

  consensusAccount: (searchTerm: string) => {
    if (isValidOasisAddress(searchTerm.replace(/\s/g, '').toLowerCase())) {
      return searchTerm.replace(/\s/g, '').toLowerCase()
    }
  },
  evmAccount: (searchTerm: string) => {
    if (isValidEthAddress(`0x${searchTerm}`)) {
      return `0x${searchTerm.toLowerCase()}`
    }
    if (isValidEthAddress(searchTerm)) {
      return searchTerm.toLowerCase()
    }
  },
} satisfies { [name: string]: (searchTerm: string) => string | undefined }

export function isSearchValid(searchTerm: string) {
  return Object.values(validateAndNormalize).some(fn => !!fn(searchTerm))
}
