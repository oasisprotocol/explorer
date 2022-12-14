/** @file Wrappers around generated API */

import { UseQueryOptions } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { useSearchParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'

export * from './generated/api'

function fromBaseUnits(valueInBaseUnits: string, decimals: number): string {
  const value = new BigNumber(valueInBaseUnits).shiftedBy(-decimals) // / 10 ** decimals
  if (value.isNaN()) {
    throw new Error(`Not a number in fromBaseUnits(${valueInBaseUnits})`)
  }
  return value.toFixed()
}

export const useGetEmeraldTransactions = (
  params?: generated.GetEmeraldTransactionsParams,
  options?: { query: UseQueryOptions<AxiosResponse<generated.RuntimeTransactionList>> },
) => {
  const [searchParams] = useSearchParams()
  const offsetSearchQuery = searchParams.get('offset')
  const offset = (offsetSearchQuery && parseInt(offsetSearchQuery, 10)) || 0

  const result = generated.useGetEmeraldTransactions({ ...params, offset }, options)
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

export const useGetEmeraldBlocks = (
  params?: generated.GetEmeraldBlocksParams,
  options?: { query: UseQueryOptions<AxiosResponse<generated.RuntimeBlockList>> },
) => {
  const [searchParams] = useSearchParams()
  const offsetSearchQuery = searchParams.get('offset')
  const offset = (offsetSearchQuery && parseInt(offsetSearchQuery, 10)) || 0

  return generated.useGetEmeraldBlocks({ ...params, offset }, options)
}
