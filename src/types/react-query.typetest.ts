import { AxiosResponse } from 'axios'
import {
  Runtime,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeBlocks,
  useGetRuntimeTransactions,
} from '../oasis-indexer/api'

type BlocksWithExtra = AxiosResponse<{
  blocks: Array<RuntimeBlock & { extraProperty: boolean }>
}>

type TransactionsWithExtra = AxiosResponse<{
  transactions: Array<RuntimeTransaction & { extraProperty: boolean }>
}>

export function ExpectStructuralSharingToHaveCorrectType() {
  const blocks = useGetRuntimeBlocks<BlocksWithExtra>(Runtime.emerald, undefined, {
    query: {
      refetchInterval: 1000,
      structuralSharing: (prev, next) => {
        // Previously returned value should have new property
        expect(prev?.data.blocks[0].extraProperty).toBeDefined()
        // @ts-expect-error New data should not have it
        expect(next.data.blocks[0].extraProperty).toBeUndefined()

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
  expect(blocks.data?.data.blocks[0].round).toBeDefined()
  // Should return new property
  expect(blocks.data?.data.blocks[0].extraProperty).toBeDefined()
  // @ts-expect-error Shouldn't allow everything
  expect(blocks.data?.data.blocks[0].typo).toBeUndefined()

  const txs = useGetRuntimeTransactions<TransactionsWithExtra>(Runtime.emerald, undefined, {
    query: {
      refetchInterval: 1000,
      structuralSharing: (prev, next) => {
        // Previously returned value should have new property
        expect(prev?.data.transactions[0].extraProperty).toBeDefined()
        // @ts-expect-error New data should not have it
        expect(next.data.transactions[0].extraProperty).toBeUndefined()

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
  expect(txs.data?.data.transactions[0].method).toBeDefined()
  // Should return new property
  expect(txs.data?.data.transactions[0].extraProperty).toBeDefined()
  // @ts-expect-error Shouldn't allow everything
  expect(txs.data?.data.transactions[0].typo).toBeUndefined()
}
