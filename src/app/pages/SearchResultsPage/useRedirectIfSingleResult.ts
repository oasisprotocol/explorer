import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isConsensusBlock, SearchResults } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { isItemInScope, SearchScope } from '../../../types/searchScope'
import { Network } from '../../../types/network'
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

  const { searchTerm, accountNameFragment, evmAccount, consensusAccount } = searchParams

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
        redirectTo = RouteUtils.getBlockRoute(item, isConsensusBlock(item) ? item.height : item.round)
        break
      case 'transaction':
        redirectTo = RouteUtils.getTransactionRoute(item, item.eth_hash || item.hash)
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
          redirectTo += `?q=${accountNameFragment}`
        }
        break
      case 'contract':
        redirectTo = RouteUtils.getAccountRoute(item, item.address_eth ?? item.address)
        break
      case 'token':
        redirectTo = `${RouteUtils.getTokenRoute(
          item,
          item.eth_contract_addr || item.contract_addr,
        )}?q=${searchTerm}`
        break
      case 'proposal':
        redirectTo = `${RouteUtils.getProposalRoute(item.network, item.id)}?q=${searchTerm}`
        break
      default:
        exhaustedTypeWarning('Unexpected result type', item)
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
