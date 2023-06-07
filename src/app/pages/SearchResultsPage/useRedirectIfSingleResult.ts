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

  let shouldRedirect = !isLoading && results.length === 1

  if (shouldRedirect) {
    const result = results[0]
    shouldRedirect = scope ? isItemInScope(result, scope) : result.network === Network.mainnet
  }

  let redirectTo: string | undefined
  if (shouldRedirect) {
    const item = results[0]
    switch (item.resultType) {
      case 'block':
        redirectTo = RouteUtils.getBlockRoute(item, item.round)
        break
      case 'transaction':
        redirectTo = RouteUtils.getTransactionRoute(item, item.eth_hash || item.hash)
        break
      case 'account':
        redirectTo = RouteUtils.getAccountRoute(item, item.address_eth ?? item.address)
        break
      default:
        // The conversion of any is necessary here, since we have covered all possible subtype,
        // and TS is concluding that the only possible remaining type is "never".
        // However, if we all more result types in the future and forget to add the appropriate case here,
        // we might hit this, hence the warning.
        console.log(`Don't know how to redirect to unknown search result type ${(item as any).resultType}`)
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
