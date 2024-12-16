import { ConsensusTxMethod, Transaction } from '../../oasis-nexus/api'

export const getConsensusTransactionToAddress = (transaction: Transaction) => {
  switch (transaction.method) {
    case ConsensusTxMethod.stakingAddEscrow:
      return transaction.body?.account
    case ConsensusTxMethod.stakingAllow:
      return transaction.body?.beneficiary
    case ConsensusTxMethod.stakingReclaimEscrow:
      return transaction.body?.account
    case ConsensusTxMethod.stakingTransfer:
      return transaction.body?.to
    default:
      return undefined
  }
}

export const getConsensusTransactionAmount = (transaction: Transaction) => {
  switch (transaction.method) {
    case ConsensusTxMethod.stakingAllow:
      return transaction.body?.negative
        ? `-${transaction.body?.amount_change}`
        : transaction.body?.amount_change
    case ConsensusTxMethod.stakingAddEscrow:
    case ConsensusTxMethod.stakingTransfer:
      return transaction.body?.amount
    default:
      return undefined
  }
}
export const isRoflTransaction = (method: string | undefined): boolean => {
  const roflMethods = ['rofl.Create', 'rofl.Update', 'rofl.Remove', 'rofl.Register']
  return method ? roflMethods.includes(method) : false
}
