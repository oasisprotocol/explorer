/** @file Wrappers around generated API */

import { UseQueryOptions } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'

export * from './generated/api'

function fromBaseUnits(baseUnits: string, decimals: number): string {
  // TODO: use BigNumber.shiftBy
  return (parseInt(baseUnits) / 10 ** decimals).toString()
}

export const useGetEmeraldTransactions = (
  params?: generated.GetEmeraldTransactionsParams,
  options?: { query: UseQueryOptions<AxiosResponse<generated.RuntimeTransactionList>> },
) => {
  const result = generated.useGetEmeraldTransactions(params, options)
  if (result.data) {
    return {
      ...result,
      data: {
        ...result.data,
        data: {
          ...result.data.data,
          transactions: result.data.data.transactions?.map(tx => {
            return {
              ...tx,
              fee_amount: tx.fee_amount
                ? fromBaseUnits(tx.fee_amount, paraTimesConfig.emerald.decimals)
                : undefined,
              amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig.emerald.decimals) : undefined,
            }
          }),
        },
      },
    }
  }
  return result
}
