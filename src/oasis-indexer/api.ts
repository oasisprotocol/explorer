/** @file Wrappers around generated API */

import axios, { AxiosError, AxiosResponse } from 'axios'
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

export const useGetEmeraldTransactions: typeof generated.useGetEmeraldTransactions = (params?, options?) => {
  const result = generated.useGetEmeraldTransactions(params, {
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
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig.emerald.decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig.emerald.decimals) : undefined,
              }
            }),
          }
        },
        ...arrayify(options?.axios?.transformResponse),
      ],
    },
  })
  return result
}

export interface FullConsensusAccount extends generated.Account {
  runtime_evm_balances: generated.RuntimeEvmBalance[]
}

export const useGetConsensusAccountsAddress = generated.useGetConsensusAccountsAddress<
  AxiosResponse<FullConsensusAccount>,
  AxiosError<generated.HumanReadableErrorResponse | generated.NotFoundErrorResponse>
>
