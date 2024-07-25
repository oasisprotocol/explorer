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
      return transaction.body?.amount_change
    case ConsensusTxMethod.stakingAddEscrow:
    case ConsensusTxMethod.stakingTransfer:
      return transaction.body?.amount
    default:
      return undefined
  }
}
