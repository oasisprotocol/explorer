/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { consensusDecimals, getTokensForScope, paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  Account,
  EvmToken,
  EvmTokenType,
  GetRuntimeAccountsAddress,
  HumanReadableErrorResponse,
  Layer,
  NotFoundErrorResponse,
  Runtime,
  RuntimeAccount,
  RuntimeEventType,
} from './generated/api'
import {
  getAccountSize,
  getEthAccountAddressFromBase64,
  getEthAccountAddressFromPreimage,
  getOasisAddressOrNull,
  isValidEthAddress,
} from '../app/utils/helpers'
import { getCancelTitle, getParameterChangeTitle, getProposalTitle } from '../app/utils/proposals'
import { Network } from '../types/network'
import { SearchScope } from '../types/searchScope'
import { Ticker } from '../types/ticker'
import { getRPCAccountBalances } from '../app/utils/getRPCAccountBalances'
import { toChecksumAddress } from '@ethereumjs/util'
import { fromBaseUnits } from '../app/utils/number-utils'
import { getConsensusTransactionAmount, getConsensusTransactionToAddress } from '../app/utils/transaction'
import { API_MAX_TOTAL_COUNT } from '../config'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export type HasScope = SearchScope

// TODO: Remove when API is updated
export interface EntityMetadata {
  v: number
  serial: number
  name?: string
  url?: string
  email?: string
  keybase?: string
  twitter?: string
}

declare module './generated/api' {
  export interface Transaction {
    amount: string | undefined
    to: string | undefined
    network: Network
    layer: Layer
    ticker: Ticker
  }

  export interface RuntimeTransaction {
    network: Network
    layer: Layer
  }

  export interface Block {
    network: Network
    layer: Layer
  }

  export interface RuntimeBlock {
    network: Network
    layer: Layer
  }

  export interface Account {
    network: Network
    layer: Layer
    ticker: Ticker
    size: string
    total: string
  }

  export interface RuntimeAccount {
    network: Network
    layer: Layer
    address_eth?: string
    tokenBalances: Partial<Record<EvmTokenType, generated.RuntimeEvmBalance[]>>
  }

  export interface RuntimeEvent {
    network: Network
    layer: Layer
  }

  export interface EvmAbiParam {
    /** Added to fields that are likely an amount in tokens */
    evm_token?: EvmEventToken
    value_raw?: string
  }

  export interface ConsensusEvent {
    network: Network
  }

  export interface EvmToken {
    network: Network
    layer: Layer
  }

  export interface BareTokenHolder {
    network: Network
    layer: Layer
    rank: number
  }

  export interface Proposal {
    network: Network
    layer: typeof Layer.consensus
  }

  export interface Delegation {
    network: Network
    layer: typeof Layer.consensus
    ticker: Ticker
  }

  export interface DebondingDelegation {
    layer: typeof Layer.consensus
    network: Network
    ticker: Ticker
  }

  export interface ValidatorHistoryPoint {
    layer: typeof Layer.consensus
    network: Network
    ticker: Ticker
  }

  export interface Escrow {
    otherBalance: TextBigInt | undefined
  }

  export interface Validator {
    ticker: Ticker
  }

  export interface ValidatorAggStats {
    ticker: Ticker
  }

  export interface RoflApp {
    layer: typeof Layer.sapphire
    network: Network
    ticker: Ticker
  }
}

export const isAccountEmpty = (account: RuntimeAccount | Account) => {
  if (account.layer === Layer.consensus) {
    const {
      available,
      nonce,
      debonding_delegations_balance,
      delegations_balance,
      escrow,
      total,
      first_activity,
      stats,
    } = account as Account
    return (
      available === '0' &&
      debonding_delegations_balance === '0' &&
      delegations_balance === '0' &&
      escrow === '0' &&
      total === '0' &&
      nonce === 0 &&
      stats.num_txns === 0 &&
      !first_activity
    )
  } else {
    const { balances, evm_balances, stats } = account as RuntimeAccount
    const { total_received, total_sent, num_txns } = stats
    const hasNoBalances = [...balances, ...evm_balances].every(b => b.balance === '0' || b.balance === '0.0')
    const hasNoTransactions = total_received === '0' && total_sent === '0' && num_txns === 0
    return hasNoBalances && hasNoTransactions
  }
}

export const isAccountNonEmpty = (account: RuntimeAccount | Account) => !isAccountEmpty(account)

export const groupAccountTokenBalances = (account: Omit<RuntimeAccount, 'tokenBalances'>): RuntimeAccount => {
  const tokenBalances: Partial<Record<generated.EvmTokenType, generated.RuntimeEvmBalance[]>> = {}
  account.evm_balances.forEach(balance => {
    if (balance.token_type) {
      tokenBalances[balance.token_type] ??= []
      tokenBalances[balance.token_type]!.push(balance)
    }
  })

  return {
    ...account,
    tokenBalances,
  }
}

function arrayify<T>(arrayOrItem: null | undefined | T | T[]): T[] {
  if (arrayOrItem == null) return []
  if (!Array.isArray(arrayOrItem)) return [arrayOrItem]
  return arrayOrItem
}

export const useGetConsensusTransactions: typeof generated.useGetConsensusTransactions = (
  network,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusTransactions(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              const amount = getConsensusTransactionAmount(tx)
              const to = getConsensusTransactionToAddress(tx)
              return {
                ...tx,
                amount,
                to,
                network,
                layer: Layer.consensus,
                ticker,
                fee: fromBaseUnits(tx.fee, consensusDecimals),
                body: {
                  ...tx.body,
                  amount: tx.body?.amount ? fromBaseUnits(tx.body.amount, consensusDecimals) : undefined,
                  amount_change: tx.body?.amount_change
                    ? fromBaseUnits(tx.body.amount_change, consensusDecimals)
                    : undefined,
                },
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

const adjustRuntimeTransactionMethod = (
  method: string | undefined,
  isLikelyNativeTokenTransfer: boolean | undefined,
) => (isLikelyNativeTokenTransfer ? 'accounts.Transfer' : method)

/** Replace "" with native denomination, and prohibit unknown denominations */
function normalizeSymbol(rawSymbol: string | '' | undefined, scope: SearchScope) {
  const symbol = rawSymbol || getTokensForScope(scope)[0].ticker
  const whitelistedTickers = getTokensForScope(scope).map(a => a.ticker)
  return whitelistedTickers.includes(symbol as Ticker) ? symbol : 'n/a'
}

/** Returns checksummed maybeMatchingEthAddr if it matches oasisAddress when converted */
function fallbackEthAddress(
  oasisAddress: generated.Address | undefined,
  maybeMatchingEthAddr: generated.EthOrOasisAddress | undefined,
): `0x${string}` | undefined {
  if (
    oasisAddress &&
    maybeMatchingEthAddr &&
    isValidEthAddress(maybeMatchingEthAddr) &&
    getOasisAddressOrNull(maybeMatchingEthAddr) === oasisAddress
  ) {
    return toChecksumAddress(maybeMatchingEthAddr)
  }
}

export const useGetRuntimeTransactions: typeof generated.useGetRuntimeTransactions = (
  network,
  runtime,
  params?,
  options?,
) => {
  return generated.useGetRuntimeTransactions(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) =>
          transformRuntimeTransactionList(data, network, runtime, status, params?.rel),
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusTransactionsTxHash: typeof generated.useGetConsensusTransactionsTxHash = (
  network,
  txHash,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusTransactionsTxHash(network, txHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TransactionList, headers, status) => {
          if (status !== 200) return data

          // Temporary workaround for old Nexus instances
          if (!('transactions' in data)) {
            data = {
              is_total_count_clipped: false,
              total_count: 1,
              transactions: [data],
            }
          }

          return {
            ...data,
            transactions: data.transactions.map(tx => {
              const amount = getConsensusTransactionAmount(tx)
              const to = getConsensusTransactionToAddress(tx)
              return {
                ...tx,
                amount,
                to,
                network,
                layer: Layer.consensus,
                ticker,
                fee: fromBaseUnits(tx.fee, consensusDecimals),
                body: {
                  ...tx.body,
                  amount: tx.body?.amount ? fromBaseUnits(tx.body.amount, consensusDecimals) : undefined,
                  amount_change: tx.body?.amount_change
                    ? fromBaseUnits(tx.body.amount_change, consensusDecimals)
                    : undefined,
                },
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  network,
  runtime,
  txHash,
  options?,
) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
  return generated.useGetRuntimeTransactionsTxHash(network, runtime, actualHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) =>
          transformRuntimeTransactionList(data, network, runtime, status),
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusAccountsAddress: typeof generated.useGetConsensusAccountsAddress = (
  network,
  address,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusAccountsAddress(network, address, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      enabled: options?.query?.enabled ?? true,
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          const total =
            BigInt(data.available) +
            BigInt(data.delegations_balance) +
            BigInt(data.debonding_delegations_balance)
          return {
            ...data,
            available: fromBaseUnits(data.available, consensusDecimals),
            total: fromBaseUnits(total.toString(), consensusDecimals),
            delegations_balance: fromBaseUnits(data.delegations_balance.toString(), consensusDecimals),
            debonding_delegations_balance: fromBaseUnits(
              data.debonding_delegations_balance.toString(),
              consensusDecimals,
            ),
            layer: Layer.consensus,
            network,
            size: getAccountSize(total),
            ticker,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeAccountsAddress: typeof generated.useGetRuntimeAccountsAddress = (
  network,
  runtime,
  address,
  options,
) => {
  const query = generated.useGetRuntimeAccountsAddress(network, runtime, address, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      enabled: !!address && (options?.query?.enabled ?? true),
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return groupAccountTokenBalances({
            ...data,
            address_eth:
              getEthAccountAddressFromPreimage(data.address_preimage) ||
              fallbackEthAddress(data.address, address),
            evm_contract: data.evm_contract && {
              ...data.evm_contract,
              eth_creation_tx: data.evm_contract.eth_creation_tx
                ? `0x${data.evm_contract.eth_creation_tx}`
                : undefined,
            },
            evm_balances: (data.evm_balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            balances: (data.balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            layer: runtime,
            network,
            stats: {
              ...data.stats,
              total_received: data.stats?.total_received
                ? fromBaseUnits(data.stats?.total_received, paraTimesConfig[runtime].decimals)
                : '0',
              total_sent: data.stats?.total_sent
                ? fromBaseUnits(data.stats?.total_sent, paraTimesConfig[runtime].decimals)
                : '0',
            },
          })
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  }) as UseQueryResult<
    Awaited<ReturnType<typeof GetRuntimeAccountsAddress>>,
    HumanReadableErrorResponse | NotFoundErrorResponse
  > & { queryKey: QueryKey }

  const runtimeAccount = query.data?.data

  // TODO: Remove after account balances on Nexus are in sync with the node
  const oasisAddress = getOasisAddressOrNull(address)
  const rpcAccountBalances = useQuery({
    enabled: !!oasisAddress,
    queryKey: [oasisAddress, network, runtime],
    queryFn: async () => {
      if (!oasisAddress) throw new Error('Needed to fix types - see `enabled`')
      return await getRPCAccountBalances(oasisAddress, { network: network, layer: runtime })
    },
  }).data

  const data =
    rpcAccountBalances && runtimeAccount
      ? {
          ...runtimeAccount,
          balances: rpcAccountBalances,
        }
      : runtimeAccount

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          data,
        }
      : query.data,
    // TypeScript complaining for no good reason
  } as any
}

const MAX_LOADED_ADDRESSES = 100
const MASS_LOAD_INDEXES = [...Array(MAX_LOADED_ADDRESSES).keys()]

type RuntimeTarget = {
  network: Network
  layer: Runtime
  address: string
}

export const useGetRuntimeAccountsAddresses = (
  targets: RuntimeTarget[] | undefined = [],
  queryOptions: { enabled: boolean },
) => {
  const queries = MASS_LOAD_INDEXES.map((i): RuntimeTarget | undefined => targets[i]).map(target =>
    // The number of iterations is constant here, so we will always call the hook the same number.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetRuntimeAccountsAddress(
      target?.network ?? Network.mainnet,
      target?.layer ?? Layer.emerald,
      target?.address ?? '',
      {
        query: { enabled: queryOptions.enabled && !!target?.address },
      },
    ),
  )
  return {
    isLoading: !!targets?.length && queries.some(query => query.isLoading && query.fetchStatus !== 'idle'),
    isError: queries.some(query => query.isError) || targets?.length > MAX_LOADED_ADDRESSES,
    data: queries.map(query => query.data?.data).filter(account => !!account) as RuntimeAccount[],
  }
}

type ConsensusTarget = {
  network: Network
  address: string
}

export const useGetConsensusAccountsAddresses = (
  targets: ConsensusTarget[] | undefined = [],
  queryOptions: { enabled: boolean },
) => {
  const queries = MASS_LOAD_INDEXES.map((i): ConsensusTarget | undefined => targets[i]).map(target =>
    // The number of iterations is constant here, so we will always call the hook the same number.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetConsensusAccountsAddress(target?.network ?? Network.mainnet, target?.address ?? '', {
      query: { enabled: queryOptions.enabled && !!target?.address },
    }),
  )

  return {
    isLoading: !!targets?.length && queries.some(query => query.isLoading && query.fetchStatus !== 'idle'),
    isError: queries.some(query => query.isError) || targets?.length > MAX_LOADED_ADDRESSES,
    data: queries.map(query => query.data?.data).filter(account => !!account) as generated.Account[],
  }
}

export function useGetConsensusBlockByHeight(
  network: Network,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetConsensusBlocksHeight<AxiosResponse<generated.Block, any>>(
    network,
    blockHeight,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (block: generated.Block, headers, status) => {
            if (status !== 200) return block
            return {
              ...block,
              layer: Layer.consensus,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

export function useGetConsensusBlockByHash(
  network: Network,
  blockHash: string,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetConsensusBlocks(
    network,
    { hash: blockHash },
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.BlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.hash !== blockHash) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: Layer.consensus,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

// TODO: replace with an appropriate API
export function useGetRuntimeBlockByHeight(
  network: Network,
  runtime: generated.Runtime,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { to: blockHeight, limit: 1 }
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    network,
    runtime,
    params,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.RuntimeBlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.round !== blockHeight) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: runtime,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

export function useGetRuntimeBlockByHash(
  network: Network,
  runtime: generated.Runtime,
  blockHash: string,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { hash: blockHash }
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    network,
    runtime,
    params,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.RuntimeBlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.hash !== blockHash) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: runtime,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

export const useGetConsensusBlocks: typeof generated.useGetConsensusBlocks = (network, params, options) => {
  return generated.useGetConsensusBlocks(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.BlockList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            blocks: data.blocks.map(block => {
              return {
                ...block,
                layer: Layer.consensus,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeBlocks: typeof generated.useGetRuntimeBlocks = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeBlocks(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeBlockList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            blocks: data.blocks.map(block => {
              return {
                ...block,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokens: typeof generated.useGetRuntimeEvmTokens = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokens(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.EvmTokenList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            evm_tokens: data.evm_tokens.map(token => {
              return {
                ...token,
                total_supply: token.total_supply
                  ? fromBaseUnits(token.total_supply, token.decimals || 0)
                  : undefined,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokensAddress: typeof generated.useGetRuntimeEvmTokensAddress = (
  network,
  runtime,
  address,
  options,
) => {
  return generated.useGetRuntimeEvmTokensAddress(network, runtime, address, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      enabled: options?.query?.enabled ?? true,
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: EvmToken, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            total_supply: data.total_supply
              ? fromBaseUnits(data.total_supply, data.decimals || 0)
              : undefined,
            network,
            layer: runtime,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

const fixChecksumAddressInEvmEventParam = (param: generated.EvmAbiParam): generated.EvmAbiParam =>
  param.evm_type === 'address'
    ? {
        ...param,
        value: toChecksumAddress(param.value as string),
      }
    : param

const addTokenToParams = (event: generated.RuntimeEvent) => {
  if (event.evm_token?.type === 'ERC20') {
    if (event.evm_log_name === 'Transfer' || event.evm_log_name === 'Approval') {
      const valueParam = event.evm_log_params?.[2]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        valueParam.evm_token = event.evm_token
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, event.evm_token.decimals ?? 0)
      }
    }
    if (event.evm_log_name === 'Deposit') {
      // wROSE
      const valueParam = event.evm_log_params?.[1]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        const nativeSymbol = getTokensForScope({ network: event.network, layer: event.layer })[0].ticker
        const nativeDecimals = paraTimesConfig[event.layer]!.decimals
        valueParam.evm_token = {
          type: event.evm_token.type,
          // These could be incorrect if function isn't payable, so add parentheses
          symbol: `(${nativeSymbol})`,
          decimals: nativeDecimals,
        }
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, nativeDecimals)
      }
    }
    if (event.evm_log_name === 'Withdrawal') {
      // wROSE
      const valueParam = event.evm_log_params?.[1]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        valueParam.evm_token = event.evm_token
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, event.evm_token.decimals ?? 0)
      }
    }
  }
  if (event.evm_token?.type === 'ERC721') {
    if (event.evm_log_name === 'Transfer' || event.evm_log_name === 'Approval') {
      const tokenParam = event.evm_log_params?.[2]
      if (tokenParam?.evm_type === 'uint256' && typeof tokenParam.value === 'string') {
        tokenParam.evm_token = event.evm_token
      }
    }
  }
  return event
}

export const useGetRuntimeEvents: typeof generated.useGetRuntimeEvents = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvents(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeEventList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            events: data.events
              .map((event): generated.RuntimeEvent => {
                return {
                  ...event,
                  body: {
                    ...event.body,
                    owner_eth: event.body?.owner_eth || fallbackEthAddress(event.body.owner, params?.rel),
                    from_eth: event.body?.from_eth || fallbackEthAddress(event.body.from, params?.rel),
                    to_eth: event.body?.to_eth || fallbackEthAddress(event.body.to, params?.rel),
                    address:
                      event.type === RuntimeEventType.evmlog
                        ? getEthAccountAddressFromBase64(event.body.address)
                        : event.body.address,
                  },
                  evm_log_params: event.evm_log_params?.map(fixChecksumAddressInEvmEventParam),
                  eth_tx_hash: event.eth_tx_hash ? `0x${event.eth_tx_hash}` : undefined,
                  layer: runtime,
                  network,
                }
              })
              .map(event => {
                return addTokenToParams(event)
              })
              .map((event): generated.RuntimeEvent => {
                if (
                  event.type === RuntimeEventType.accountstransfer ||
                  event.type === RuntimeEventType.accountsmint ||
                  event.type === RuntimeEventType.accountsburn ||
                  event.type === RuntimeEventType.consensus_accountsdeposit ||
                  event.type === RuntimeEventType.consensus_accountswithdraw ||
                  event.type === RuntimeEventType.consensus_accountsdelegate ||
                  event.type === RuntimeEventType.consensus_accountsundelegate_done
                  // consensus_accountsundelegate_start doesn't contain amount
                ) {
                  return {
                    ...event,
                    body: {
                      ...event.body,
                      amount: {
                        // If denomination="" or missing then use runtime's native. Otherwise unknown (would have to get by token name?).
                        ...event.body.amount,
                        Amount: fromBaseUnits(event.body.amount.Amount, paraTimesConfig[runtime].decimals),
                        Denomination: event.body.amount.Denomination || getTokensForScope(event)[0].ticker,
                      },
                    },
                  }
                }
                return event
              }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusEvents: typeof generated.useGetConsensusEvents = (network, params, options) => {
  return generated.useGetConsensusEvents(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ConsensusEventList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            events: data.events.map(event => {
              return {
                ...event,
                body: {
                  ...event.body,
                  // staking.transfer, staking.escrow.take, staking.escrow.reclaim, staking.escrow.debonding_start, staking.escrow.add
                  amount: event.body.amount ? fromBaseUnits(event.body.amount, consensusDecimals) : undefined,
                  // staking.allowance_change
                  allowance: event.body.allowance
                    ? fromBaseUnits(event.body.allowance, consensusDecimals)
                    : undefined,
                  // staking.allowance_change
                  amount_change: event.body.amount_change
                    ? fromBaseUnits(event.body.amount_change, consensusDecimals)
                    : undefined,
                },
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokensAddressHolders: typeof generated.useGetRuntimeEvmTokensAddressHolders = (
  network,
  runtime,
  address,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokensAddressHolders(network, runtime, address, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TokenHolderList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            holders: data.holders.map((holder, index) => {
              return {
                ...holder,
                rank: index + (params?.offset ?? 0) + 1,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusProposals: typeof generated.useGetConsensusProposals = (
  network,
  params?,
  options?,
) => {
  return generated.useGetConsensusProposals(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ProposalList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            proposals: data.proposals.map(proposal => {
              return {
                ...proposal,
                network,
                layer: Layer.consensus,
                deposit: fromBaseUnits(proposal.deposit, consensusDecimals),
                title: getProposalTitle(proposal),
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusProposalsProposalId: typeof generated.useGetConsensusProposalsProposalId = (
  network,
  proposalId,
  options?,
) => {
  return generated.useGetConsensusProposalsProposalId(network, proposalId, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Proposal, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            network,
            layer: Layer.consensus,
            deposit: fromBaseUnits(data.deposit, consensusDecimals),
            title: getProposalTitle(data),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusProposalsByName = (network: Network, nameFragment: string | undefined) => {
  const query = useGetConsensusProposals(network, {}, { query: { enabled: !!nameFragment } })
  const { isError, isLoading, isInitialLoading, data, status, error } = query
  const textMatcher = nameFragment
    ? (proposal: generated.Proposal): boolean => {
        if (proposal.title?.includes(nameFragment)) {
          return true
        }

        if (proposal.handler?.includes(nameFragment)) {
          return true
        }

        if (getCancelTitle(proposal.cancels).includes(nameFragment)) {
          return true
        }

        return (
          !!proposal.parameters_change &&
          getParameterChangeTitle(proposal.parameters_change_module, proposal.parameters_change).includes(
            nameFragment,
          )
        )
      }
    : () => false
  const results = data ? query.data.data.proposals.filter(textMatcher) : undefined
  return {
    isLoading,
    isError,
    isInitialLoading,
    status,
    error,
    results,
  }
}

export type ExtendedValidatorList = generated.ValidatorList & {
  map?: Map<string, generated.Validator>
}

export type ValidatorAddressNameMap = { [oasisAddress: string]: string | undefined }

export const useGetConsensusValidatorsAddressNameMap: typeof generated.useGetConsensusValidators<
  AxiosResponse<ValidatorAddressNameMap>
> = (network, params?, options?) => {
  return generated.useGetConsensusValidators(
    network,
    { limit: API_MAX_TOTAL_COUNT, ...params },
    {
      ...options,
      query: {
        queryKey: ['consensusValidatorsAddressNameMap', network, params],
        staleTime: options?.query?.staleTime ?? 5 * 60 * 1000, // Defaults to 5 minutes
        ...options?.query,
      },
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.ValidatorList, headers, status) => {
            if (status !== 200) return data
            const validators: ValidatorAddressNameMap = {}
            data.validators.forEach(validator => {
              validators[validator.entity_address] = validator.media?.name
            })
            return validators
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    },
  )
}

export const useGetConsensusValidators: typeof generated.useGetConsensusValidators = (
  network,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusValidators(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ValidatorList, headers, status): ExtendedValidatorList => {
          if (status !== 200) return data
          const validators = data.validators.map((validator): generated.Validator => {
            return {
              ...validator,
              escrow: {
                ...validator.escrow,
                active_balance: validator.escrow?.active_balance
                  ? fromBaseUnits(validator.escrow.active_balance, consensusDecimals)
                  : undefined,
                active_balance_24: validator.escrow?.active_balance_24
                  ? fromBaseUnits(validator.escrow.active_balance_24, consensusDecimals)
                  : undefined,
                debonding_balance: validator.escrow?.debonding_balance
                  ? fromBaseUnits(validator.escrow.debonding_balance, consensusDecimals)
                  : undefined,
                self_delegation_balance: validator.escrow?.self_delegation_balance
                  ? fromBaseUnits(validator.escrow.self_delegation_balance, consensusDecimals)
                  : undefined,
              },
              ticker,
            }
          })
          const map = new Map<string, generated.Validator>()
          validators.forEach(validator => map.set(validator.entity_address, validator))
          return {
            ...data,
            stats: {
              ...data.stats,
              total_staked_balance: fromBaseUnits(data.stats.total_staked_balance, consensusDecimals),
              ticker,
            },
            validators,
            map,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusValidatorsAddressHistory: typeof generated.useGetConsensusValidatorsAddressHistory =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusValidatorsAddressHistory(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.ValidatorHistory, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              history: data.history.map(history => {
                return {
                  ...history,
                  active_balance: history.active_balance
                    ? fromBaseUnits(history.active_balance, consensusDecimals)
                    : undefined,
                  layer: Layer.consensus,
                  network,
                  ticker,
                }
              }),
            }
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }
export const useGetConsensusValidatorsAddress: typeof generated.useGetConsensusValidatorsAddress = (
  network,
  address,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusValidatorsAddress(network, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ValidatorList, headers, status): ExtendedValidatorList => {
          if (status !== 200) return data
          const validators = data.validators.map((validator): generated.Validator => {
            const otherBalance =
              validator.escrow.active_balance && validator.escrow.self_delegation_balance
                ? BigInt(validator.escrow.active_balance) - BigInt(validator.escrow.self_delegation_balance)
                : undefined

            return {
              ...validator,
              escrow: {
                ...validator.escrow,
                active_balance: validator.escrow?.active_balance
                  ? fromBaseUnits(validator.escrow.active_balance, consensusDecimals)
                  : undefined,
                active_balance_24: validator.escrow?.active_balance_24
                  ? fromBaseUnits(validator.escrow.active_balance_24, consensusDecimals)
                  : undefined,
                debonding_balance: validator.escrow?.debonding_balance
                  ? fromBaseUnits(validator.escrow.debonding_balance, consensusDecimals)
                  : undefined,
                self_delegation_balance: validator.escrow?.self_delegation_balance
                  ? fromBaseUnits(validator.escrow.self_delegation_balance, consensusDecimals)
                  : undefined,
                otherBalance: otherBalance
                  ? fromBaseUnits(otherBalance.toString(), consensusDecimals)
                  : undefined,
              },
              ticker,
            }
          })
          return {
            ...data,
            validators,
            stats: {
              ...data.stats,
              total_staked_balance: fromBaseUnits(data.stats.total_staked_balance, consensusDecimals),
              ticker,
            },
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusAccounts: typeof generated.useGetConsensusAccounts = (
  network,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusAccounts(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.AccountList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            accounts: data.accounts.map(account => {
              const total =
                BigInt(account.available) +
                BigInt(account.delegations_balance) +
                BigInt(account.debonding_delegations_balance)

              return {
                ...account,
                available: fromBaseUnits(account.available, consensusDecimals),
                total: fromBaseUnits(total.toString(), consensusDecimals),
                delegations_balance: fromBaseUnits(account.delegations_balance.toString(), consensusDecimals),
                debonding_delegations_balance: fromBaseUnits(
                  account.debonding_delegations_balance.toString(),
                  consensusDecimals,
                ),
                layer: Layer.consensus,
                network,
                size: getAccountSize(total),
                ticker,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusAccountsAddressDelegations: typeof generated.useGetConsensusAccountsAddressDelegations =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusAccountsAddressDelegations(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.DelegationList, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              delegations: data.delegations.map(delegation => {
                return {
                  ...delegation,
                  amount: fromBaseUnits(delegation.amount, consensusDecimals),
                  layer: Layer.consensus,
                  network,
                  ticker,
                }
              }),
            }
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

export const useGetConsensusAccountsAddressDebondingDelegations: typeof generated.useGetConsensusAccountsAddressDebondingDelegations =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusAccountsAddressDebondingDelegations(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.DebondingDelegationList, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              debonding_delegations: data.debonding_delegations.map(delegation => {
                return {
                  ...delegation,
                  amount: fromBaseUnits(delegation.amount, consensusDecimals),
                  layer: Layer.consensus,
                  network,
                  ticker,
                }
              }),
            }
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

export const useGetConsensusAccountsAddressDebondingDelegationsTo: typeof generated.useGetConsensusAccountsAddressDebondingDelegationsTo =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusAccountsAddressDebondingDelegationsTo(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.DebondingDelegationList, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              debonding_delegations: data.debonding_delegations.map(delegation => {
                return {
                  ...delegation,
                  amount: fromBaseUnits(delegation.amount, consensusDecimals),
                  layer: Layer.consensus,
                  network,
                  ticker,
                }
              }),
            }
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

export const useGetConsensusAccountsAddressDelegationsTo: typeof generated.useGetConsensusAccountsAddressDelegationsTo =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusAccountsAddressDelegationsTo(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.DelegationList, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              delegations: data.delegations.map(delegation => {
                return {
                  ...delegation,
                  amount: fromBaseUnits(delegation.amount, consensusDecimals),
                  layer: Layer.consensus,
                  network,
                  ticker,
                }
              }),
            }
          },
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

export const useGetRuntimeRoflApps: typeof generated.useGetRuntimeRoflApps = (
  network,
  layer,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.sapphire })[0].ticker
  return generated.useGetRuntimeRoflApps(network, layer, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RoflAppList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            rofl_apps: data.rofl_apps.map(app => {
              return {
                ...app,
                stake: app.stake ? fromBaseUnits(app.stake, paraTimesConfig.sapphire.decimals) : undefined,
                network,
                layer: Layer.sapphire,
                ticker,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeRoflAppsId: typeof generated.useGetRuntimeRoflAppsId = (
  network,
  layer,
  id,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.sapphire })[0].ticker
  return generated.useGetRuntimeRoflAppsId(network, layer, id, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RoflApp, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            stake: data.stake ? fromBaseUnits(data.stake, paraTimesConfig.sapphire.decimals) : undefined,
            network,
            layer: Layer.sapphire,
            ticker,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeRoflAppsIdTransactions: typeof generated.useGetRuntimeRoflAppsIdTransactions = (
  network,
  runtime,
  id,
  params?,
  options?,
) => {
  return generated.useGetRuntimeRoflAppsIdTransactions(network, runtime, id, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) =>
          transformRuntimeTransactionList(data, network, runtime, status),
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeRoflAppsIdInstanceTransactions: typeof generated.useGetRuntimeRoflAppsIdInstanceTransactions =
  (network, runtime, id, params?, options?) => {
    return generated.useGetRuntimeRoflAppsIdInstanceTransactions(network, runtime, id, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.RuntimeTransactionList, headers, status) =>
            transformRuntimeTransactionList(data, network, runtime, status),
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

export const useGetRuntimeRoflAppsIdInstancesRakTransactions: typeof generated.useGetRuntimeRoflAppsIdInstancesRakTransactions =
  (network, runtime, id, rak, params?, options?) => {
    return generated.useGetRuntimeRoflAppsIdInstancesRakTransactions(network, runtime, id, rak, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.RuntimeTransactionList, headers, status) =>
            transformRuntimeTransactionList(data, network, runtime, status),
          ...arrayify(options?.request?.transformResponse),
        ],
      },
    })
  }

function transformRuntimeTransactionList(
  data: generated.RuntimeTransactionList,
  network: Network,
  runtime: Runtime,
  status: number | undefined,
  relAddress?: generated.EthOrOasisAddress,
): generated.RuntimeTransactionList {
  if (status !== 200) return data
  return {
    ...data,
    transactions: data.transactions.map(tx => {
      return {
        ...tx,
        to_eth: tx.to_eth || fallbackEthAddress(tx.to, relAddress),
        eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but fee_symbol
        fee: fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals),
        fee_symbol: normalizeSymbol(tx.fee_symbol, { network, layer: runtime }),
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but fee_symbol
        charged_fee: fromBaseUnits(tx.charged_fee, paraTimesConfig[runtime].decimals),
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but amount_symbol
        amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
        amount_symbol: normalizeSymbol(tx.amount_symbol, { network, layer: runtime }),
        layer: runtime,
        network,
        method: adjustRuntimeTransactionMethod(tx.method, tx.is_likely_native_token_transfer),
      }
    }),
  }
}
