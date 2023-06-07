import React, { FC } from 'react'
import { TokenPriceInfo, useTokenPrice } from '../../../coin-gecko/api'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { useSearch } from './hooks'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useParamSearch } from '../../components/Search/search-utils'
import { SearchResultsView } from './SearchResultsView'

export const SearchResultsPage: FC = () => {
  const tokenPrices: Record<Network, TokenPriceInfo> = {} as any
  // The list of networks will never change on the run, so we can do this
  // eslint-disable-next-line react-hooks/rules-of-hooks
  RouteUtils.getEnabledNetworks().forEach(net => (tokenPrices[net] = useTokenPrice(net)))

  const scope = useScopeParam()
  const searchParams = useParamSearch()
  const { results, isLoading } = useSearch(searchParams)

  useRedirectIfSingleResult()

  return (
    <SearchResultsView
      wantedScope={scope}
      searchResults={results}
      isLoading={isLoading}
      tokenPrices={tokenPrices}
    />
  )
}
