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
  Proposal,
  useGetConsensusProposalsByName,
  Account,
  useGetConsensusAccountsAddress,
  Block,
  useGetConsensusBlockByHeight,
  useGetConsensusBlockByHash,
  Transaction,
  useGetConsensusTransactionsTxHash,
  useGetRuntimeRoflAppsId,
  RoflApp,
} from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'
import { SearchParams } from '../../components/Search/search-utils'
import { SearchScope } from '../../../types/searchScope'
import { useSearchForAccountsByName } from '../../hooks/useAccountMetadata'
import { useSearchForValidatorsByName } from '../../hooks/useSearchForValidatorsByName'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

export type ConditionalResults<T> = { isLoading: boolean; isError?: boolean; results: T[] }

type SearchResultItemCore = HasScope & {
  resultType: 'block' | 'transaction' | 'account' | 'contract' | 'token' | 'proposal' | 'roflApp'
}

export type BlockResult = SearchResultItemCore & (RuntimeBlock | Block) & { resultType: 'block' }

export type TransactionResult = SearchResultItemCore &
  (RuntimeTransaction | Transaction) & { resultType: 'transaction' }

export type AccountResult = SearchResultItemCore & (RuntimeAccount | Account) & { resultType: 'account' }

export type ContractResult = SearchResultItemCore & RuntimeAccount & { resultType: 'contract' }

export type RoflAppResult = SearchResultItemCore & RoflApp & { resultType: 'roflApp' }

export type TokenResult = SearchResultItemCore & EvmToken & { resultType: 'token' }

export type ProposalResult = SearchResultItemCore & Proposal & { resultType: 'proposal' }

export type SearchResultItem =
  | BlockResult
  | TransactionResult
  | AccountResult
  | ContractResult
  | RoflAppResult
  | TokenResult
  | ProposalResult

export type SearchResults = SearchResultItem[]

export function isConsensusBlock(
  block: BlockResult,
): block is SearchResultItemCore & Block & { resultType: 'block' } {
  return block.layer === Layer.consensus
}

export function isConsensusTransaction(
  transaction: TransactionResult,
): transaction is SearchResultItemCore & Transaction & { resultType: 'transaction' } {
  return transaction.layer === Layer.consensus
}

export function useRuntimeBlocksByHeightConditionally(
  currentScope: SearchScope | undefined,
  blockHeight: string | undefined,
): ConditionalResults<RuntimeBlock> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
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

export function useConsensusBlocksByHeightConditionally(
  currentScope: SearchScope | undefined,
  blockHeight: string | undefined,
): ConditionalResults<Block> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
    .filter(scope => scope.layer === Layer.consensus)
    .map(scope =>
      /**
       * Normally, calling React hooks from callbacks and other conditional code
       * is not a good idea, but in this case, we can be sure that the number of
       * enabled combinations will never change during runtime
       * (since it's hard-coded in route-utils.ts), so we can just ignore
       * the lint warning about abusing the rules of hooks.
       */
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetConsensusBlockByHeight(scope.network, parseInt(blockHeight!), {
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

export function useRuntimeBlocksByHashConditionally(
  currentScope: SearchScope | undefined,
  blockHash: string | undefined,
): ConditionalResults<RuntimeBlock> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
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

export function useConsensusBlocksByHashConditionally(
  currentScope: SearchScope | undefined,
  blockHash: string | undefined,
): ConditionalResults<Block> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
    .filter(scope => scope.layer === Layer.consensus)
    .map(scope =>
      /**
       * Normally, calling React hooks from callbacks and other conditional code
       * is not a good idea, but in this case, we can be sure that the number of
       * enabled combinations will never change during runtime
       * (since it's hard-coded in route-utils.ts), so we can just ignore
       * the lint warning about abusing the rules of hooks.
       */
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetConsensusBlockByHash(scope.network, blockHash || '', {
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

export function useRuntimeTransactionsConditionally(
  currentScope: SearchScope | undefined,
  txHash: string | undefined,
): ConditionalResults<RuntimeTransaction> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
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

export function useConsensusTransactionsConditionally(
  currentScope: SearchScope | undefined,
  txHash: string | undefined,
): ConditionalResults<Transaction> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
    .filter(scope => scope.layer === Layer.consensus)
    .map(scope =>
      // See explanation above
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetConsensusTransactionsTxHash(scope.network, txHash!, {
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
  currentScope: SearchScope | undefined,
  address: string | undefined,
): ConditionalResults<RuntimeAccount> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
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

export function useConsensusAccountConditionally(address: string | undefined): ConditionalResults<Account> {
  const queries = RouteUtils.getEnabledNetworksForLayer(Layer.consensus).map(network =>
    // See explanation above
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetConsensusAccountsAddress(network, address!, {
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
  currentScope: SearchScope | undefined,
  nameFragment: string | undefined,
): ConditionalResults<EvmTokenList> {
  const queries = RouteUtils.getVisibleScopes(currentScope)
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
    isError: queries.some(query => query.isError),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}

export function useNetworkProposalsConditionally(
  nameFragment: string | undefined,
): ConditionalResults<Proposal> {
  const queries = RouteUtils.getEnabledNetworksForLayer(Layer.consensus).map(network =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetConsensusProposalsByName(network, nameFragment),
  )
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    isError: queries.some(query => query.isError),
    results: queries
      .map(query => query.results)
      .filter(isDefined)
      .flat(),
  }
}

export function useNamedAccountConditionally(
  currentScope: SearchScope | undefined,
  nameFragment: string | undefined,
): ConditionalResults<Account | RuntimeAccount> {
  const queries = RouteUtils.getVisibleScopes(currentScope).map(scope =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSearchForAccountsByName(scope, nameFragment),
  )
  return {
    isLoading: queries.some(query => query.isLoading),
    isError: queries.some(query => query.isError),
    results: queries
      .map(query => query.results)
      .filter(isDefined)
      .flat(),
  }
}

export function useNamedValidatorConditionally(nameFragment: string | undefined) {
  const queries = RouteUtils.getEnabledNetworksForLayer(Layer.consensus).map(network =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSearchForValidatorsByName(network, nameFragment),
  )
  return {
    isLoading: queries.some(query => query.isLoading),
    isError: queries.some(query => query.isError),
    results: queries
      .map(query => query.results)
      .filter(isDefined)
      .flat(),
  }
}

export function useRoflAppConditionally(id: string | undefined): ConditionalResults<RoflApp> {
  const queries = RouteUtils.getEnabledNetworksForLayer(Layer.sapphire).map(network =>
    // See explanation above
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetRuntimeRoflAppsId(network, Layer.sapphire, id!, {
      query: {
        enabled: !!id,
      },
    }),
  )

  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}

export const useSearch = (currentScope: SearchScope | undefined, q: SearchParams) => {
  const queries = {
    runtimeBlockHeight: useRuntimeBlocksByHeightConditionally(currentScope, q.blockHeight),
    runtimeBlockHash: useRuntimeBlocksByHashConditionally(currentScope, q.blockHash),
    consensusBlockHeight: useConsensusBlocksByHeightConditionally(currentScope, q.blockHeight),
    consensusBlockHash: useConsensusBlocksByHashConditionally(currentScope, q.blockHash),
    runtimeTxHash: useRuntimeTransactionsConditionally(currentScope, q.txHash),
    consensusTxHash: useConsensusTransactionsConditionally(currentScope, q.txHash),
    oasisConsensusAccount: useConsensusAccountConditionally(q.consensusAccount),
    oasisRuntimeAccount: useRuntimeAccountConditionally(currentScope, q.consensusAccount),
    evmAccount: useRuntimeAccountConditionally(currentScope, q.evmAccount),
    roflApp: useRoflAppConditionally(q.roflApp),
    accountsByName: useNamedAccountConditionally(currentScope, q.accountNameFragment),
    validatorByName: useNamedValidatorConditionally(q.validatorNameFragment),
    tokens: useRuntimeTokenConditionally(currentScope, q.evmTokenNameFragment),
    proposals: useNetworkProposalsConditionally(q.networkProposalNameFragment),
  }
  const isLoading = Object.values(queries).some(query => query.isLoading)
  const hasErrors = Object.values(queries).some(query => query.isError)
  const blocks = [
    ...queries.consensusBlockHeight.results,
    ...queries.consensusBlockHash.results,
    ...queries.runtimeBlockHeight.results,
    ...queries.runtimeBlockHash.results,
  ]
  const transactions = [...(queries.runtimeTxHash.results || []), ...(queries.consensusTxHash.results || [])]
  const tokens = queries.tokens.results
    .map(l => l.evm_tokens)
    .flat()
    .sort((t1, t2) => t2.num_holders - t1.num_holders)
  const alreadyAToken = new Set(tokens.map(t => t.network + t.layer + t.contract_addr))
  const accounts = [
    ...(queries.oasisConsensusAccount.results || []),
    ...(queries.oasisRuntimeAccount.results || []),
    ...(queries.evmAccount.results || []),
    ...(queries.accountsByName.results || []),
    ...(queries.validatorByName.results || []),
  ]
    .filter(isAccountNonEmpty)
    .filter(a => !alreadyAToken.has(a.network + a.layer + a.address)) // Deduplicate tokens
  const roflApps = queries.roflApp.results
  const proposals = queries.proposals.results

  const results: SearchResultItem[] = isLoading
    ? []
    : [
        ...blocks.map((block): BlockResult => ({ ...block, resultType: 'block' })),
        ...transactions.map((tx): TransactionResult => ({ ...tx, resultType: 'transaction' })),
        ...tokens.map((token): TokenResult => ({ ...token, resultType: 'token' })),
        ...accounts
          .filter(account => !(account as RuntimeAccount).evm_contract)
          .map((account): AccountResult => ({ ...account, resultType: 'account' })),
        ...accounts
          .filter((account): account is RuntimeAccount => account.layer !== Layer.consensus)
          .filter(account => account.evm_contract)
          .map((account): ContractResult => ({ ...account, resultType: 'contract' })),
        ...roflApps.map((roflApp): RoflAppResult => ({ ...roflApp, resultType: 'roflApp' })),
        ...proposals.map((proposal): ProposalResult => ({ ...proposal, resultType: 'proposal' })),
      ]
  return {
    isLoading,
    hasErrors,
    results,
  }
}
