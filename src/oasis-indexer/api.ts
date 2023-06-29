/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { UseQueryOptions } from '@tanstack/react-query'
import { EvmToken, Layer, RuntimeAccount } from './generated/api'
import { fromBaseUnits, getEthAccountAddressFromPreimage } from '../app/utils/helpers'
import { Network } from '../types/network'
import { SearchScope } from '../types/searchScope'
import { getTickerForNetwork, NativeTicker } from '../types/ticker'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export type HasScope = SearchScope

declare module './generated/api' {
  export interface Transaction {
    network: Network
    layer: Layer
    ticker: NativeTicker
  }
  export interface RuntimeTransaction {
    network: Network
    layer: Layer
    ticker: NativeTicker
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
    ticker: NativeTicker
  }
  export interface RuntimeAccount {
    network: Network
    layer: Layer
    address_eth?: string
    ticker: NativeTicker
    tokenBalances: Record<EvmTokenType, generated.RuntimeEvmBalance[]>
  }

  export interface EvmToken {
    network: Network
    layer: Layer
  }
}

export const isAccountEmpty = (account: RuntimeAccount) => {
  const { balances, evm_balances, stats } = account
  const { total_received, total_sent, num_txns } = stats
  const result =
    !balances?.length && !evm_balances?.length && total_received === '0' && total_sent === '0' && !num_txns
  return result
}

export const isAccountNonEmpty = (account: RuntimeAccount) => !isAccountEmpty(account)

export const groupAccountTokenBalances = (account: Omit<RuntimeAccount, 'tokenBalances'>): RuntimeAccount => {
  const tokenBalances: Record<generated.EvmTokenType, generated.RuntimeEvmBalance[]> = {
    ERC20: [],
  }
  account.evm_balances.forEach(balance => {
    if (balance.token_type) tokenBalances[balance.token_type].push(balance)
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
  const ticker = getTickerForNetwork(network)
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
              return {
                ...tx,
                network,
                layer: Layer.consensus,
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

export const useGetRuntimeTransactions: typeof generated.useGetRuntimeTransactions = (
  network,
  runtime,
  params?,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeTransactions(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
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

export const useGetConsensusTransactionsTxHash: typeof generated.useGetConsensusTransactionsTxHash = (
  network,
  txHash,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetConsensusTransactionsTxHash(network, txHash, {
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
              return {
                ...tx,
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

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  network,
  runtime,
  txHash,
  options?,
) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeTransactionsTxHash(network, runtime, actualHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
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

export const useGetConsensusAccountsAddress: typeof generated.useGetConsensusAccountsAddress = (
  network,
  address,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetConsensusAccountsAddress(network, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            layer: Layer.consensus,
            network,
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
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeAccountsAddress(network, runtime, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return groupAccountTokenBalances({
            ...data,
            address_eth: getEthAccountAddressFromPreimage(data.address_preimage),
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
            ticker,
          })
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
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
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}
