import {
  RuntimeTransaction,
  RuntimeTransactionList,
  Transaction,
  TransactionList,
} from '../../oasis-nexus/api'

type TransactionSelectionResult<T> = {
  wantedTransaction?: T
  warningMultipleTransactionsSameHash?: boolean
}

export function useWantedTransaction(
  transactionsList: TransactionList | undefined,
): TransactionSelectionResult<Transaction>
export function useWantedTransaction(
  transactionsList: RuntimeTransactionList | undefined,
): TransactionSelectionResult<RuntimeTransaction>

export function useWantedTransaction(
  transactionsList: TransactionList | RuntimeTransactionList | undefined,
): TransactionSelectionResult<Transaction | RuntimeTransaction> {
  const transactions = transactionsList?.transactions ?? []

  if (!transactions.length) {
    // Loading or error
    return {}
  } else if (transactions.length === 1) {
    return {
      wantedTransaction: transactions[0],
    }
  } else {
    const successfulOne = transactions.find(transaction => transaction.success)
    const latestOne = transactions.sort((a, b) => {
      if ('round' in a && 'round' in b) {
        return b.round - a.round // RuntimeTransaction
      } else if ('block' in a && 'block' in b) {
        return b.block - a.block //  Transaction
      } else {
        return 0
      }
    })[0]

    return {
      warningMultipleTransactionsSameHash: true,
      wantedTransaction: successfulOne ?? latestOne,
    }
  }
}
