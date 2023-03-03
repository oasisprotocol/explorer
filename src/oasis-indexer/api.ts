/** @file Wrappers around generated API */

import axios from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import BigNumber from 'bignumber.js'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

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
        (data: generated.RuntimeTransactionList) => {
          return {
            ...data,
            transactions: (data.transactions || []).map(tx => {
              return {
                ...tx,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig.emerald!.decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig.emerald!.decimals) : undefined,
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeAccountsAddress: typeof generated.useGetRuntimeAccountsAddress = (
  runtime,
  params,
  options?,
) => {
  return generated.useGetRuntimeAccountsAddress(runtime, params, {
    ...options,
    axios: {
      ...options?.axios,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount) => {
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
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
}
