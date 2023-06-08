import {
  RuntimeAccount,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeAccountsAddress,
  useGetRuntimeBlockByHeight,
  useGetRuntimeTransactionsTxHash,
  Runtime,
  Layer,
  isAccountNonEmpty,
  HasScope,
} from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'
import { SearchParams } from '../../components/Search/search-utils'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

export type ConditionalResults<T> = { isLoading: boolean; results: T[] }

type SearchResultItemCore = HasScope & {
  resultType: 'block' | 'transaction' | 'account'
}

export type BlockResult = SearchResultItemCore & RuntimeBlock & { resultType: 'block' }

export type TransactionResult = SearchResultItemCore & RuntimeTransaction & { resultType: 'transaction' }

export type AccountResult = SearchResultItemCore & RuntimeAccount & { resultType: 'account' }

export type SearchResultItem = BlockResult | TransactionResult | AccountResult

export type SearchResults = SearchResultItem[]

export function useBlocksConditionally(blockHeight: string | undefined): ConditionalResults<RuntimeBlock> {
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      /**
       * Normally, calling React hooks from callbacks and other conditional code
       * is not a good idea, but in this case, we can be sure that the number of
       * enabled combinations will never change during runtime
       * (since it's hard-coded in route-utils.ts), so we can just ignore
       * the lint warning about abusing the rules of hooks.
       */
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeBlockByHeight(scope.network, scope.layer as Runtime, parseInt(blockHeight!), {
        query: {
          enabled: !!blockHeight,
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
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // See explanation above
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeTransactionsTxHash(scope.network, scope.layer as Runtime, txHash!, {
        query: {
          enabled: !!txHash,
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
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // See explanation above
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeAccountsAddress(scope.network, scope.layer as Runtime, address!, {
        query: {
          enabled: !!address,
        },
      }),
    )

  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}

export const useSearch = (q: SearchParams) => {
  const queries = {
    blockHeight: useBlocksConditionally(q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    txHash: useTransactionsConditionally(q.txHash),
    oasisAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
  }
  const isLoading = Object.values(queries).some(query => query.isLoading)
  const blocks = queries.blockHeight.results || []
  const transactions = queries.txHash.results || []
  const accounts = [
    ...(queries.oasisAccount.results || []),
    ...(queries.evmBech32Account.results || []),
  ].filter(isAccountNonEmpty)
  const results: SearchResultItem[] = isLoading
    ? []
    : [
        ...blocks.map((block): BlockResult => ({ ...block, resultType: 'block' })),
        ...transactions.map((tx): TransactionResult => ({ ...tx, resultType: 'transaction' })),
        ...accounts.map((account): AccountResult => ({ ...account, resultType: 'account' })),
      ]
  return {
    isLoading,
    results,
  }
}
