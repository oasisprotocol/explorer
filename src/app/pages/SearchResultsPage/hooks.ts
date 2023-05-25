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
  const queries = RouteUtils.getEnabledScopes()
    .filter(scope => scope.layer !== Layer.consensus)
    .map(scope =>
      /**
       * Normally, calling React hooks from callbacks and other conditional code
       * is not a good idea, but in this case, we can be sure that the number of
       * enabled combinations will never change during runtime
       * (since it's hard-coded in route-utils.ts), su we can just ignore
       * the TS warning about abusing the rules of hooks.
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
