import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchQueries } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { HasNetwork } from '../../../oasis-indexer/api'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(network: Network | undefined, queries: SearchQueries) {
  const navigate = useNavigate()

  const isAnyLoading = Object.values(queries).some(query => query.isLoading)

  const allResults = Object.values(queries).flatMap<HasNetwork>(query => query.results ?? [])

  const hasSingleResult = !isAnyLoading && allResults.length === 1
  const shouldRedirect =
    hasSingleResult && network
      ? allResults[0].network === network // When searching within a network, we redirect if the match is at the right network
      : allResults[0].network === Network.mainnet // when searching globally, we only redirect to mainnet results

  let redirectTo: string | undefined
  const block = queries.blockHeight.results?.[0]
  const tx = queries.txHash.results?.[0]
  const evmAccount = queries.evmBech32Account.results?.[0]
  const oasisAccount = queries.oasisAccount.results?.[0]
  if (shouldRedirect) {
    if (block) {
      redirectTo = RouteUtils.getBlockRoute(block.network, block.round, block.layer)
    } else if (tx) {
      redirectTo = RouteUtils.getTransactionRoute(tx.network, tx.eth_hash || tx.hash, tx.layer)
    } else if (evmAccount) {
      redirectTo = RouteUtils.getAccountRoute(
        evmAccount.network,
        evmAccount.address_eth ?? evmAccount.address,
        evmAccount.layer,
      )
    } else if (oasisAccount) {
      redirectTo = RouteUtils.getAccountRoute(
        oasisAccount.network,
        oasisAccount.address_eth ?? oasisAccount.address,
        oasisAccount.layer,
      )
    } else {
      // TODO: typescript should ensure all queries are handled
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
