import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchQueries } from '.'
import { RouteUtils } from '../../utils/route-utils'
import { Layer } from '../../../oasis-indexer/api'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(queries: SearchQueries) {
  const navigate = useNavigate()

  const isAnyLoading = Object.values(queries).some(query => query.isLoading)
  const hasSingleResult =
    !isAnyLoading && Object.values(queries).flatMap<unknown>(query => query.results ?? []).length === 1

  let redirectTo: string | undefined
  if (hasSingleResult) {
    if (queries.emeraldBlockHeight.results?.[0]) {
      redirectTo = RouteUtils.getBlockRoute(queries.emeraldBlockHeight.results[0].round, Layer.emerald)
    } else if (queries.emeraldTxHash.results?.[0]) {
      redirectTo = RouteUtils.getTransactionRoute(queries.emeraldTxHash.results[0].hash, Layer.emerald)
    } else if (queries.evmBech32Account.results?.[0]) {
      redirectTo = RouteUtils.getAccountRoute(queries.evmBech32Account.results[0].address, Layer.emerald)
    } else if (queries.consensusAccount.results?.[0]) {
      redirectTo = RouteUtils.getAccountRoute(queries.consensusAccount.results[0].address, Layer.emerald)
    } else {
      // TODO: typescript should ensure all queries are handled
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
