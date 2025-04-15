import { consensusDecimals } from '../../config'
import { ConsensusTxMethod, Transaction } from '../../oasis-nexus/api'
import { fromBaseUnits } from './number-utils'

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
      if (transaction.body?.amount_change === undefined) return undefined
      return transaction.body?.negative
        ? `-${fromBaseUnits(transaction.body?.amount_change, consensusDecimals)}`
        : `+${fromBaseUnits(transaction.body?.amount_change, consensusDecimals)}` // "+" sign is kept in getPreciseNumberFormat
    case ConsensusTxMethod.stakingAddEscrow:
    case ConsensusTxMethod.stakingTransfer:
      if (transaction.body?.amount === undefined) return undefined
      return fromBaseUnits(transaction.body?.amount, consensusDecimals)
    default:
      return undefined
  }
}
export const isRoflTransaction = (method: string | undefined): boolean => {
  const roflMethods = [
    'rofl.Create',
    'rofl.Update',
    'rofl.Remove',
    'rofl.Register',
    'roflmarket.ProviderCreate',
    'roflmarket.ProviderUpdate',
    'roflmarket.ProviderRemove',
    'roflmarket.InstanceCreate',
    'roflmarket.InstanceTopUp',
    'roflmarket.InstanceCancel',
    'roflmarket.InstanceExecuteCmds',
  ]
  return method ? roflMethods.includes(method) : false
}
