import {
  RuntimeAccount,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeAccountsAddress,
  useGetRuntimeBlockByHeight,
  useGetRuntimeTransactionsTxHash,
  Runtime,
} from '../../../oasis-indexer/api'
import { Network } from '../../../types/network'
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
  const queries = [
    useGetRuntimeBlockByHeight(Network.mainnet, Runtime.emerald, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeBlockByHeight(Network.mainnet, Runtime.sapphire, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.sapphire),
      },
    }),
    useGetRuntimeBlockByHeight(Network.testnet, Runtime.emerald, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeBlockByHeight(Network.testnet, Runtime.sapphire, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.sapphire),
      },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
export function useTransactionsConditionally(
  txHash: string | undefined,
): ConditionalResults<RuntimeTransaction> {
  const queries = [
    useGetRuntimeTransactionsTxHash(Network.mainnet, Runtime.emerald, txHash!, {
      query: {
        enabled: !!txHash && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeTransactionsTxHash(Network.mainnet, Runtime.sapphire, txHash!, {
      query: {
        enabled:
          !!txHash && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.sapphire),
      },
    }),
    useGetRuntimeTransactionsTxHash(Network.testnet, Runtime.emerald, txHash!, {
      query: {
        enabled: !!txHash && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeTransactionsTxHash(Network.testnet, Runtime.sapphire, txHash!, {
      query: {
        enabled:
          !!txHash && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.sapphire),
      },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.flatMap(query => query.data?.data.transactions).filter(isDefined),
  }
}
export function useRuntimeAccountConditionally(
  address: string | undefined,
): ConditionalResults<RuntimeAccount> {
  const queries = [
    useGetRuntimeAccountsAddress(Network.mainnet, Runtime.emerald, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeAccountsAddress(Network.mainnet, Runtime.sapphire, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayersForNetwork(Network.mainnet).includes(Runtime.sapphire),
      },
    }),
    useGetRuntimeAccountsAddress(Network.testnet, Runtime.emerald, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.emerald),
      },
    }),
    useGetRuntimeAccountsAddress(Network.testnet, Runtime.sapphire, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayersForNetwork(Network.testnet).includes(Runtime.sapphire),
      },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
