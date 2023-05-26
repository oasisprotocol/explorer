import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useParamSearch } from '../../components/Search/search-utils'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult() {
  const navigate = useNavigate()
  const scope = useScopeParam()
  const searchParams = useParamSearch()
  const { isLoading, results: searchResults } = useSearch(searchParams)

  const hasSingleResult =
    !isLoading &&
    searchResults.allResults.length === 1 &&
    (!scope?.network || searchResults.allResults[0].network === scope.network)

  let redirectTo: string | undefined

  const block = searchResults.blocks[0]
  const tx = searchResults.transactions[0]
  const account = searchResults.accounts[0]
  if (hasSingleResult) {
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
