import {
  RuntimeAccount,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeAccountsAddress,
  useGetRuntimeBlockByHeight,
  useGetRuntimeTransactionsTxHash,
  Runtime,
  Layer,
} from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'
import { useScopeParam } from '../../hooks/useScopeParam'
import { offerSearchResultsFromDifferentParatimes } from '../../../config'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

export type ConditionalResults<T> = { isLoading: boolean; results: T[] }

export type SearchQueries = {
  blockHeight: ConditionalResults<RuntimeBlock>
  txHash: ConditionalResults<RuntimeTransaction>
  oasisAccount: ConditionalResults<RuntimeAccount>
  evmBech32Account: ConditionalResults<RuntimeAccount>
}
export function useBlocksConditionally(blockHeight: string | undefined): ConditionalResults<RuntimeBlock> {
  const wantedScope = useScopeParam()
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeBlockByHeight(scope.network, scope.layer as Runtime, parseInt(blockHeight!), {
        query: {
          enabled:
            !!blockHeight &&
            (!wantedScope || wantedScope.layer === scope.layer || offerSearchResultsFromDifferentParatimes),
        },
      }),
    )
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
export function useTransactionsConditionally(
  txHash: string | undefined,
): ConditionalResults<RuntimeTransaction> {
  const wantedScope = useScopeParam()
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeTransactionsTxHash(scope.network, scope.layer as Runtime, txHash!, {
        query: {
          enabled:
            !!txHash &&
            (!wantedScope || wantedScope.layer === scope.layer || offerSearchResultsFromDifferentParatimes),
        },
      }),
    )
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.flatMap(query => query.data?.data.transactions).filter(isDefined),
  }
}
export function useRuntimeAccountConditionally(
  address: string | undefined,
): ConditionalResults<RuntimeAccount> {
  const wantedScope = useScopeParam()
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeAccountsAddress(scope.network, scope.layer as Runtime, address!, {
        query: {
          enabled:
            !!address &&
            (!wantedScope || wantedScope.layer === scope.layer || offerSearchResultsFromDifferentParatimes),
        },
      }),
    )

  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
