import { Layer } from '../../../config'
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
   */
  static getNavigationPath(searchTerm: string): string | undefined {
    const blockHeight = validateAndNormalize.blockHeight(searchTerm)
    const txHash = validateAndNormalize.txHash(searchTerm)
    const evmAccount = validateAndNormalize.evmAccount(searchTerm)
    const consensusAccount = validateAndNormalize.consensusAccount(searchTerm)
    if (blockHeight) return RouteUtils.getBlockRoute(parseInt(blockHeight, 10), Layer.Emerald)
    if (txHash) return RouteUtils.getTransactionRoute(txHash, Layer.Emerald)
    if (evmAccount) return RouteUtils.getAccountRoute(evmAccount, Layer.Emerald)
    if (consensusAccount) return RouteUtils.getAccountRoute(consensusAccount, Layer.Emerald)
    // TODO: block hash, contract, validator, event
    return undefined
  }
}

export const searchSuggestionTerms = {
  suggestedTransaction: 'b1e68ca814d913064bd6b9460efcb64b4c6d07f3b98fa659beed46164398a830',
  suggestedBlock: '1396255',
  suggestedAccount: '0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3',
}

export const validateAndNormalize = {
  blockHeight: (searchTerm: string) => {
    const thousandSeparator = new Intl.NumberFormat().formatToParts(1234).find(p => p.type === 'group')?.value
    if (thousandSeparator && isValidBlockHeight(searchTerm.replaceAll(thousandSeparator, ''))) {
      return searchTerm.replaceAll(thousandSeparator, '')
    }
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
