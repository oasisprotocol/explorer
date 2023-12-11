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
  useGetRuntimeEvmTokens,
  EvmTokenList,
  EvmToken,
  useGetRuntimeBlockByHash,
} from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'
import { SearchParams } from '../../components/Search/search-utils'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

export type ConditionalResults<T> = { isLoading: boolean; results: T[] }

type SearchResultItemCore = HasScope & {
  resultType: 'block' | 'transaction' | 'account' | 'contract' | 'token'
}

export type BlockResult = SearchResultItemCore & RuntimeBlock & { resultType: 'block' }

export type TransactionResult = SearchResultItemCore & RuntimeTransaction & { resultType: 'transaction' }

export type AccountResult = SearchResultItemCore & RuntimeAccount & { resultType: 'account' }

export type ContractResult = SearchResultItemCore & RuntimeAccount & { resultType: 'contract' }

export type TokenResult = SearchResultItemCore & EvmToken & { resultType: 'token' }

export type SearchResultItem = BlockResult | TransactionResult | AccountResult | ContractResult | TokenResult

export type SearchResults = SearchResultItem[]

export function useBlocksByHeightConditionally(
  blockHeight: string | undefined,
): ConditionalResults<RuntimeBlock> {
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

export function useBlocksByHashConditionally(
  blockHash: string | undefined,
): ConditionalResults<RuntimeBlock> {
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
      useGetRuntimeBlockByHash(scope.network, scope.layer as Runtime, blockHash || '', {
        query: {
          enabled: !!blockHash,
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

export function useRuntimeTokenConditionally(
  nameFragment: string | undefined,
): ConditionalResults<EvmTokenList> {
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      // See explanation above
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetRuntimeEvmTokens(
        scope.network,
        scope.layer as Runtime,
        {
          name: nameFragment,
          limit: 10,
        },
        {
          query: {
            enabled: !!nameFragment,
          },
        },
      ),
    )

  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}

export const useSearch = (q: SearchParams) => {
  const queries = {
    blockHeight: useBlocksByHeightConditionally(q.blockHeight),
    blockHash: useBlocksByHashConditionally(q.blockHash),
    txHash: useTransactionsConditionally(q.txHash),
    oasisAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
    tokens: useRuntimeTokenConditionally(q.evmTokenNameFragment),
  }
  const isLoading = Object.values(queries).some(query => query.isLoading)
  const blocks = [...queries.blockHeight.results, ...queries.blockHash.results]
  const transactions = queries.txHash.results || []
  const accounts = [
    ...(queries.oasisAccount.results || []),
    ...(queries.evmBech32Account.results || []),
  ].filter(isAccountNonEmpty)
  const tokens = queries.tokens.results
    .map(l => l.evm_tokens)
    .flat()
    .sort((t1, t2) => t2.num_holders - t1.num_holders)

  const results: SearchResultItem[] = isLoading
    ? []
    : [
        ...blocks.map((block): BlockResult => ({ ...block, resultType: 'block' })),
        ...transactions.map((tx): TransactionResult => ({ ...tx, resultType: 'transaction' })),
        ...accounts
          .filter(account => !account.evm_contract)
          .map((account): AccountResult => ({ ...account, resultType: 'account' })),
        ...accounts
          .filter(account => account.evm_contract)
          .map((account): ContractResult => ({ ...account, resultType: 'contract' })),
        ...tokens.map((token): TokenResult => ({ ...token, resultType: 'token' })),
      ]
  return {
    isLoading,
    results,
  }
}
