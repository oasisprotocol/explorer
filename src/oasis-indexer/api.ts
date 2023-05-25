/** @file Wrappers around generated API */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import BigNumber from 'bignumber.js'
import { UseQueryOptions } from '@tanstack/react-query'
import { Layer } from './generated/api'
import { getEthAccountAddress } from '../app/utils/helpers'
import { Network } from '../types/network'
import { getOptionsFor, wrapWithNetwork } from './wrapper-helpers'

export type * from './generated/api'
export { Layer, Runtime, RuntimeEventType } from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export interface HasNetwork {
  network: Network
}

declare module './generated/api' {
  export interface Transaction {
    network: Network
    layer: Layer
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
  }
  export interface RuntimeAccount {
    network: Network
    layer: Layer
    address_eth?: string
  }
}

function fromBaseUnits(valueInBaseUnits: string, decimals: number): string {
  const value = new BigNumber(valueInBaseUnits).shiftedBy(-decimals) // / 10 ** decimals
  if (value.isNaN()) {
    throw new Error(`Not a number in fromBaseUnits(${valueInBaseUnits})`)
  }
  return value.toFixed()
}

function arrayify<T>(arrayOrItem: null | undefined | T | T[]): T[] {
  if (arrayOrItem == null) return []
  if (!Array.isArray(arrayOrItem)) return [arrayOrItem]
  return arrayOrItem
}

const _f1 = wrapWithNetwork(generated.useGetConsensusTransactions)

export const useGetConsensusTransactions: typeof _f1 = (network, params?, options?) =>
  generated.useGetConsensusTransactions(
    params,
    getOptionsFor(options, network, generated.getGetConsensusTransactionsQueryKey(params), {
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f2 = wrapWithNetwork(generated.useGetRuntimeTransactions)

export const useGetRuntimeTransactions: typeof _f2 = (network, runtime, params?, options?) =>
  generated.useGetRuntimeTransactions(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetRuntimeTransactionsQueryKey(runtime, params), {
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f3 = wrapWithNetwork(generated.useGetConsensusTransactionsTxHash)

export const useGetConsensusTransactionsTxHash: typeof _f3 = (network, txHash, options?) =>
  generated.useGetConsensusTransactionsTxHash(
    txHash,
    getOptionsFor(options, network, generated.getGetConsensusTransactionsTxHashQueryKey(txHash), {
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f5 = wrapWithNetwork(generated.useGetRuntimeTransactionsTxHash)

export const useGetRuntimeTransactionsTxHash: typeof _f5 = (network, runtime, txHash, options?) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
  return generated.useGetRuntimeTransactionsTxHash(
    runtime,
    actualHash,
    getOptionsFor(options, network, generated.getGetRuntimeTransactionsTxHashQueryKey(runtime, actualHash), {
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )
}

const _f6 = wrapWithNetwork(generated.useGetConsensusAccountsAddress)

export const useGetConsensusAccountsAddress: typeof _f6 = (network, address, options?) =>
  generated.useGetConsensusAccountsAddress(
    address,
    getOptionsFor(options, network, generated.getGetConsensusAccountsAddressQueryKey(address), {
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            layer: Layer.consensus,
            network,
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f7 = wrapWithNetwork(generated.useGetRuntimeAccountsAddress)

export const useGetRuntimeAccountsAddress: typeof _f7 = (network, runtime, address, options?) =>
  generated.useGetRuntimeAccountsAddress(
    runtime,
    address,
    getOptionsFor(options, network, generated.getGetRuntimeAccountsAddressQueryKey(runtime, address), {
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            address_eth: getEthAccountAddress(data.address_preimage),
            evm_balances: data.evm_balances?.map(token => {
              return {
                ...token,
                balance: token.balance ? fromBaseUnits(token.balance, token.token_decimals) : undefined,
              }
            }),
            balances: data.balances?.map(token => {
              return {
                ...token,
                balance: token.balance ? fromBaseUnits(token.balance, token.token_decimals) : undefined,
              }
            }),
            layer: runtime,
            network,
            stats: {
              ...data.stats,
              total_received: data.stats?.total_received
                ? fromBaseUnits(data.stats?.total_received, paraTimesConfig[runtime].decimals)
                : undefined,
              total_sent: data.stats?.total_sent
                ? fromBaseUnits(data.stats?.total_sent, paraTimesConfig[runtime].decimals)
                : undefined,
            },
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

export function useGetConsensusBlockByHeight(
  network: Network,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any>; axios?: AxiosRequestConfig },
) {
  return generated.useGetConsensusBlocksHeight<AxiosResponse<generated.Block, any>>(
    blockHeight,
    getOptionsFor(options, network, generated.getGetConsensusBlocksHeightQueryKey(blockHeight), {
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
    }),
  )
}

// TODO: replace with an appropriate API
export function useGetRuntimeBlockByHeight(
  network: Network,
  runtime: generated.Runtime,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any>; axios?: AxiosRequestConfig },
) {
  const params: generated.GetRuntimeBlocksParams = { to: blockHeight, limit: 1 }
  return generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetRuntimeBlocksQueryKey(runtime, params), {
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
    }),
  )
}

const _f8 = wrapWithNetwork(generated.useGetConsensusBlocks)

export const useGetConsensusBlocks: typeof _f8 = (network, params, options) =>
  generated.useGetConsensusBlocks(
    params,
    getOptionsFor(options, network, generated.getGetConsensusBlocksQueryKey(params), {
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
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f9 = wrapWithNetwork(generated.useGetRuntimeBlocks)

export const useGetRuntimeBlocks: typeof _f9 = (network, runtime, params, options) =>
  generated.useGetRuntimeBlocks(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetRuntimeBlocksQueryKey(runtime, params), {
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
        ...arrayify(options?.axios?.transformResponse),
      ],
    }),
  )

const _f10 = wrapWithNetwork(generated.useGetLayerStatsActiveAccounts)

export const useGetLayerStatsActiveAccounts: typeof _f10 = (network, runtime, params, options) =>
  generated.useGetLayerStatsActiveAccounts(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetLayerStatsActiveAccountsQueryKey(runtime)),
  )

const _f11 = wrapWithNetwork(generated.useGetLayerStatsTxVolume)

export const useGetLayerStatsTxVolume: typeof _f11 = (network, runtime, params, options) =>
  generated.useGetLayerStatsTxVolume(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetLayerStatsTxVolumeQueryKey(runtime)),
  )

const _f12 = wrapWithNetwork(generated.useGetRuntimeStatus)

export const useGetRuntimeStatus: typeof _f12 = (network, runtime, options) =>
  generated.useGetRuntimeStatus(
    runtime,
    getOptionsFor(options, network, generated.getGetRuntimeStatusQueryKey(runtime)),
  )

const _f13 = wrapWithNetwork(generated.useGetStatus)

export const useGetStatus: typeof _f13 = (network, options) =>
  generated.useGetStatus(getOptionsFor(options, network, generated.getGetStatusQueryKey()))

const _f14 = wrapWithNetwork(generated.useGetRuntimeEvents)

export const useGetRuntimeEvents: typeof _f14 = (network, runtime, params, options) =>
  generated.useGetRuntimeEvents(
    runtime,
    params,
    getOptionsFor(options, network, generated.getGetRuntimeEventsQueryKey(runtime, params)),
  )
