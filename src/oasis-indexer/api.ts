/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import BigNumber from 'bignumber.js'
import { UseQueryOptions } from '@tanstack/react-query'
import { Layer } from './generated/api'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

declare module './generated/api' {
  export interface Transaction {
    layer: Layer
  }
  export interface RuntimeTransaction {
    layer: Layer
  }
  export interface Block {
    layer: Layer
  }
  export interface RuntimeBlock {
    layer: Layer
  }
  export interface Account {
    layer: Layer
  }
  export interface RuntimeAccount {
    layer: Layer
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

// TODO: remove when sapphire API is ready
axios.interceptors.request.use(config => {
  // Mock sapphire
  if (config.url?.startsWith('/sapphire')) {
    config.url = config.url.replace('/sapphire', '/emerald')
  }
  return config
})

export const useGetConsensusTransactions: typeof generated.useGetConsensusTransactions = (
  params?,
  options?,
) => {
  return generated.useGetConsensusTransactions(params, {
    ...options,
    axios: {
      ...options?.axios,
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeTransactions: typeof generated.useGetRuntimeTransactions = (
  runtime,
  params?,
  options?,
) => {
  return generated.useGetRuntimeTransactions(runtime, params, {
    ...options,
    axios: {
      ...options?.axios,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig.emerald!.decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig.emerald!.decimals) : undefined,
                layer: runtime,
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusTransactionsTxHash: typeof generated.useGetConsensusTransactionsTxHash = (
  txHash,
  options?,
) => {
  return generated.useGetConsensusTransactionsTxHash(txHash, {
    ...options,
    axios: {
      ...options?.axios,
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  runtime,
  txHash,
  options?,
) => {
  return generated.useGetRuntimeTransactionsTxHash(runtime, txHash, {
    ...options,
    axios: {
      ...options?.axios,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig.emerald!.decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig.emerald!.decimals) : undefined,
                layer: runtime,
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusAccountsAddress: typeof generated.useGetConsensusAccountsAddress = (
  address,
  options?,
) => {
  return generated.useGetConsensusAccountsAddress(address, {
    ...options,
    axios: {
      ...options?.axios,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            layer: Layer.consensus,
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeAccountsAddress: typeof generated.useGetRuntimeAccountsAddress = (
  runtime,
  address,
  options?,
) => {
  return generated.useGetRuntimeAccountsAddress(runtime, address, {
    ...options,
    axios: {
      ...options?.axios,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,

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
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export function useGetConsensusBlockByHeight(
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetConsensusBlocksHeight<AxiosResponse<generated.Block, any>>(blockHeight, {
    ...options,
    axios: {
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (block: generated.Block, headers, status) => {
          if (status !== 200) return block
          return {
            ...block,
            layer: Layer.consensus,
          }
        },
      ],
    },
  })
  return result
}

// TODO: replace with an appropriate API
export function useGetRuntimeBlockByHeight(
  runtime: generated.Runtime,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    runtime,
    { to: blockHeight, limit: 1 },
    {
      ...options,
      axios: {
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
            }
          },
        ],
      },
    },
  )
  return result
}

export const useGetConsensusBlocks: typeof generated.useGetConsensusBlocks = (params, options) => {
  return generated.useGetConsensusBlocks(params, {
    ...options,
    axios: {
      ...options?.axios,
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeBlocks: typeof generated.useGetRuntimeBlocks = (runtime, params, options) => {
  return generated.useGetRuntimeBlocks(runtime, params, {
    ...options,
    axios: {
      ...options?.axios,
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
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}
