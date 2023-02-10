import { isValidBlockHeight } from '../../utils/helpers'
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
