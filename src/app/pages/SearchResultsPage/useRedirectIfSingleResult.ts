import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isConsensusBlock, isConsensusTransaction, SearchResults } from './hooks'
import { encodeURIComponentPretty, RouteUtils } from '../../utils/route-utils'
import { isItemInScope, SearchScope } from '../../../types/searchScope'
import { exhaustedTypeWarning } from '../../../types/errors'
import { RuntimeAccount } from '../../../oasis-nexus/api'
import { SearchParams } from '../../components/Search/search-utils'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(
  scope: SearchScope | undefined,
  searchParams: SearchParams,
  results: SearchResults,
) {
  const navigate = useNavigate()
  const { query, accountNameFragment, evmAccount, consensusAccount } = searchParams

  let shouldRedirect = results.length === 1

  if (shouldRedirect) {
    const result = results[0]
    shouldRedirect = scope ? isItemInScope(result, scope) : result.network === 'mainnet'
  }

  let redirectTo: string | undefined

  if (shouldRedirect) {
    const item = results[0]
    switch (item.resultType) {
      case 'block':
        redirectTo = RouteUtils.getBlockRoute(item, isConsensusBlock(item) ? item.height : item.round)
        break
      case 'transaction':
        redirectTo = RouteUtils.getTransactionRoute(
          item,
          isConsensusTransaction(item) ? item.hash : item.eth_hash || item.hash,
        )
        break
      case 'account':
        redirectTo = RouteUtils.getAccountRoute(item, (item as RuntimeAccount).address_eth ?? item.address)
        if (
          accountNameFragment && // Is there anything to highlight?
          !(
            (!!evmAccount &&
              // Did we find this searching for evm address
              (item as RuntimeAccount).address_eth?.toLowerCase() === evmAccount.toLowerCase()) ||
            // Did we find this searching for oasis address
            (!!consensusAccount && item.address.toLowerCase() === consensusAccount.toLowerCase())
          ) // If we found this account based on address, then we don't want to highlight that.
        ) {
          redirectTo += `?q=${encodeURIComponentPretty(query)}`
        }
        break
      case 'contract':
        redirectTo = RouteUtils.getAccountRoute(item, item.address_eth ?? item.address)
        break
      case 'token':
        redirectTo = `${RouteUtils.getTokenRoute(
          item,
          item.eth_contract_addr || item.contract_addr,
        )}?q=${encodeURIComponentPretty(query)}`
        break
      case 'proposal':
        redirectTo = `${RouteUtils.getProposalRoute(item.network, item.id)}?q=${encodeURIComponentPretty(query)}`
        break
      case 'roflApp':
        redirectTo = `${RouteUtils.getRoflAppRoute(item.network, item.id)}?q=${encodeURIComponentPretty(query)}`
        break
      case 'validator':
        redirectTo = `${RouteUtils.getValidatorRoute(item.network, item.entity || item.address)}?q=${encodeURIComponentPretty(query)}`
        break
      default:
        exhaustedTypeWarning('Unexpected result type', item)
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
