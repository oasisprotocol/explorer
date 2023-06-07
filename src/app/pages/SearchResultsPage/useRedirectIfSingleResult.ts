import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchResults } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { isItemInScope, SearchScope } from '../../../types/searchScope'
import { Network } from '../../../types/network'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(
  scope: SearchScope | undefined,
  isLoading: boolean,
  results: SearchResults,
) {
  const navigate = useNavigate()

  let shouldRedirect = !isLoading && results.allResults.length === 1

  if (shouldRedirect) {
    const result = results.allResults[0]
    shouldRedirect = scope ? isItemInScope(result, scope) : result.network === Network.mainnet
  }

  let redirectTo: string | undefined

  const block = results.blocks[0]
  const tx = results.transactions[0]
  const account = results.accounts[0]
  if (shouldRedirect) {
    if (block) {
      redirectTo = RouteUtils.getBlockRoute(block, block.round)
    } else if (tx) {
      redirectTo = RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)
    } else if (account) {
      redirectTo = RouteUtils.getAccountRoute(account, account.address_eth ?? account.address)
    } else {
      // TODO: typescript should ensure all queries are handled
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
