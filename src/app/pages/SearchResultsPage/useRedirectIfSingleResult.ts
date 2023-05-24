import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchQueries } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { HasScope } from '../../../oasis-indexer/api'
import { SearchScope } from '../../../types/searchScope'
import { Network } from '../../../types/network'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(scope: SearchScope | undefined, queries: SearchQueries) {
  const navigate = useNavigate()

  const isAnyLoading = Object.values(queries).some(query => query.isLoading)

  const allResults = Object.values(queries).flatMap<HasScope>(query => query.results ?? [])

  let redirectTo: string | undefined

  if (!isAnyLoading && allResults.length === 1) {
    const result = allResults[0]
    const shouldRedirect = scope // Do we have a scope?
      ? result.network === scope.network && result.layer === scope.layer // When searching in a scope, only redirect to matching
      : result.network === Network.mainnet // In global search, only redirect to mainnet results

    const block = queries.blockHeight.results?.[0]
    const tx = queries.txHash.results?.[0]
    const evmAccount = queries.evmBech32Account.results?.[0]
    const oasisAccount = queries.oasisAccount.results?.[0]
    if (shouldRedirect) {
      if (block) {
        redirectTo = RouteUtils.getBlockRoute(block, block.round)
      } else if (tx) {
        redirectTo = RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)
      } else if (evmAccount) {
        redirectTo = RouteUtils.getAccountRoute(evmAccount, evmAccount.address_eth ?? evmAccount.address)
      } else if (oasisAccount) {
        redirectTo = RouteUtils.getAccountRoute(
          oasisAccount,
          oasisAccount.address_eth ?? oasisAccount.address,
        )
      } else {
        // TODO: typescript should ensure all queries are handled
      }
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
