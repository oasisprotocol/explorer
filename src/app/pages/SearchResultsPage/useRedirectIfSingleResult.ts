import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchQueries } from '.'
import { RouteUtils } from '../../utils/route-utils'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(queries: SearchQueries) {
  const navigate = useNavigate()

  const isAnyLoading = Object.values(queries).some(query => query.isLoading)
  const hasSingleResult =
    !isAnyLoading && Object.values(queries).flatMap<unknown>(query => query.results ?? []).length === 1

  let redirectTo: string | undefined
  const block = queries.blockHeight.results?.[0]
  const tx = queries.txHash.results?.[0]
  const evmAccount = queries.evmBech32Account.results?.[0]
  const oasisAccount = queries.oasisAccount.results?.[0]
  if (hasSingleResult) {
    if (block) {
      redirectTo = RouteUtils.getBlockRoute(block.round, block.layer)
    } else if (tx) {
      redirectTo = RouteUtils.getTransactionRoute(tx.eth_hash || tx.hash, tx.layer)
    } else if (evmAccount) {
      redirectTo = RouteUtils.getAccountRoute(evmAccount.address_eth ?? evmAccount.address, evmAccount.layer)
    } else if (oasisAccount) {
      redirectTo = RouteUtils.getAccountRoute(
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
