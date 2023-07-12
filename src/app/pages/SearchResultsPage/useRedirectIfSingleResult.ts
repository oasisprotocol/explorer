import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchResults } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { isItemInScope, SearchScope } from '../../../types/searchScope'
import { Network } from '../../../types/network'
import { exhaustedTypeWarning } from '../../../types/errors'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(scope: SearchScope | undefined, results: SearchResults) {
  const navigate = useNavigate()

  let shouldRedirect = results.length === 1

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
      case 'contract':
        redirectTo = RouteUtils.getAccountRoute(item, item.address_eth ?? item.address)
        break
      case 'token':
        redirectTo = RouteUtils.getTokenRoute(item, item.eth_contract_addr || item.contract_addr)
        break
      default:
        exhaustedTypeWarning('Unexpected result type', item)
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
