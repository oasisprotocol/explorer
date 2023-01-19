import { AxiosResponse } from 'axios'
import {
  RuntimeBlock,
  RuntimeTransaction,
  useGetEmeraldBlocks,
  useGetEmeraldTransactions,
} from '../oasis-indexer/api'

type BlocksWithExtra = AxiosResponse<{
  blocks: Array<RuntimeBlock & { extraProperty: boolean }>
}>

type TransactionsWithExtra = AxiosResponse<{
  transactions: Array<RuntimeTransaction & { extraProperty: boolean }>
}>

export function expectStructuralSharingToHaveCorrectType() {
  const blocks = useGetEmeraldBlocks<BlocksWithExtra>(undefined, {
    query: {
      refetchInterval: 1000,
      structuralSharing: (prev, next) => {
        // Previously returned value should have new property
        prev?.data.blocks[0].extraProperty
        // @ts-expect-error New data should not have it
        next.data.blocks[0].extraProperty

        return {
          ...next,
          data: {
            blocks: next.data.blocks.map(block => ({ ...block, extraProperty: !!prev })),
          },
        }
      },
    },
  })
  // Should keep existing properties
  blocks.data?.data.blocks[0].round
  // Should return new property
  blocks.data?.data.blocks[0].extraProperty
  // @ts-expect-error Shouldn't allow everything
  blocks.data?.data.blocks[0].typo

  const txs = useGetEmeraldTransactions<TransactionsWithExtra>(undefined, {
    query: {
      refetchInterval: 1000,
      structuralSharing: (prev, next) => {
        // Previously returned value should have new property
        prev?.data.transactions[0].extraProperty
        // @ts-expect-error New data should not have it
        next.data.transactions[0].extraProperty

        return {
          ...next,
          data: {
            transactions: next.data.transactions.map(tx => ({ ...tx, extraProperty: !!prev })),
          },
        }
      },
    },
  })
  // Should keep existing properties
  txs.data?.data.transactions[0].method
  // Should return new property
  txs.data?.data.transactions[0].extraProperty
  // @ts-expect-error Shouldn't allow everything
  txs.data?.data.transactions[0].typo
}
