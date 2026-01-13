import { ConsensusTxMethod, GetConsensusTransactionsParams } from '../../../oasis-nexus/api'
import { ConsensusTransactionTypeFilterOption, ConsensusTxMethodFilterOption } from '.'
import { TFunction } from 'i18next'
import { exhaustedTypeWarning } from 'types/errors'

export const getConsensusTransactionLabel = (t: TFunction, method: ConsensusTxMethod | undefined): string => {
  switch (method) {
    case ConsensusTxMethod.stakingTransfer:
      return t('transactions.method.stakingTransfer')
    case ConsensusTxMethod.stakingAddEscrow:
      return t('transactions.method.stakingAddEscrow')
    case ConsensusTxMethod.stakingReclaimEscrow:
      return t('transactions.method.stakingReclaimEscrow')
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return t('transactions.method.stakingAmendCommissionSchedule')
    case ConsensusTxMethod.stakingAllow:
      return t('transactions.method.stakingAllow')
    case ConsensusTxMethod.stakingWithdraw:
      return t('transactions.method.stakingWithdraw')
    case ConsensusTxMethod.roothashExecutorCommit:
      return t('transactions.method.roothashExecutorCommit')
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return t('transactions.method.roothashExecutorProposerTimeout')
    case ConsensusTxMethod.registryRegisterEntity:
      return t('transactions.method.registryRegisterEntity')
    case ConsensusTxMethod.registryRegisterNode:
      return t('transactions.method.registryRegisterNode')
    case ConsensusTxMethod.registryRegisterRuntime:
      return t('transactions.method.registryRegisterRuntime')
    case ConsensusTxMethod.governanceCastVote:
      return t('transactions.method.governanceCastVote')
    case ConsensusTxMethod.governanceSubmitProposal:
      return t('transactions.method.governanceSubmitProposal')
    case ConsensusTxMethod.beaconPVSSCommit:
      return t('transactions.method.beaconPVSSCommit')
    case ConsensusTxMethod.beaconPVSSReveal:
      return t('transactions.method.beaconPVSSReveal')
    case ConsensusTxMethod.beaconVRFProve:
      return t('transactions.method.beaconVRFProve')
    case ConsensusTxMethod.consensusMeta:
      return t('transactions.method.consensus.meta')
    case ConsensusTxMethod.keymanagerPublishEphemeralSecret:
      return t('transactions.method.keyManager.publishEphemeralSecret')
    case ConsensusTxMethod.keymanagerPublishMasterSecret:
      return t('transactions.method.keyManager.publishMasterSecret')
    case ConsensusTxMethod.keymanagerUpdatePolicy:
      return t('transactions.method.keyManager.updatePolicy')
    case ConsensusTxMethod['keymanager/churpApply']:
      return t('transactions.method.keyManager.churp.apply')
    case ConsensusTxMethod['keymanager/churpConfirm']:
      return t('transactions.method.keyManager.churp.confirm')
    case ConsensusTxMethod['keymanager/churpCreate']:
      return t('transactions.method.keyManager.churp.create')
    case ConsensusTxMethod['keymanager/churpUpdate']:
      return t('transactions.method.keyManager.churp.update')
    case ConsensusTxMethod.registryDeregisterEntity:
      return t('transactions.method.registryDeregisterEntity')
    case ConsensusTxMethod.registryProveFreshness:
      return t('transactions.method.registryProveFreshness')
    case ConsensusTxMethod.registryUnfreezeNode:
      return t('transactions.method.registryUnfreezeNode')
    case ConsensusTxMethod.roothashEvidence:
      return t('transactions.method.roothashEvidence')
    case ConsensusTxMethod.roothashSubmitMsg:
      return t('transactions.method.roothashSubmitMessage')
    case ConsensusTxMethod.stakingBurn:
      return t('transactions.method.stakingBurn')
    case ConsensusTxMethod.vaultAuthorizeAction:
      return t('transactions.method.vault.authorizeAction')
    case ConsensusTxMethod.vaultCancelAction:
      return t('transactions.method.vault.cancelAction')
    case ConsensusTxMethod.vaultCreate:
      return t('transactions.method.vault.create')
    case undefined:
      return t('common.missing')
    default:
      exhaustedTypeWarning('Unexpected consensus transaction method', method)
      return method || t('common.unknown')
  }
}

// List of known consensus ts types, to offer in filter
// Please keep them in alphabetical order
const knownConsensusTxMethods = [
  ConsensusTxMethod.stakingAllow,
  ConsensusTxMethod.stakingAmendCommissionSchedule,
  ConsensusTxMethod.governanceCastVote,
  ConsensusTxMethod.stakingBurn,
  ConsensusTxMethod.consensusMeta,
  ConsensusTxMethod.stakingWithdraw,
  ConsensusTxMethod.registryDeregisterEntity,
  ConsensusTxMethod.roothashExecutorCommit,
  ConsensusTxMethod.roothashExecutorProposerTimeout,
  ConsensusTxMethod['keymanager/churpApply'],
  ConsensusTxMethod['keymanager/churpConfirm'],
  ConsensusTxMethod['keymanager/churpCreate'],
  ConsensusTxMethod['keymanager/churpUpdate'],
  ConsensusTxMethod.keymanagerPublishEphemeralSecret,
  ConsensusTxMethod.keymanagerPublishMasterSecret,
  ConsensusTxMethod.keymanagerUpdatePolicy,
  ConsensusTxMethod.beaconPVSSCommit,
  ConsensusTxMethod.beaconPVSSReveal,
  ConsensusTxMethod.registryRegisterEntity,
  ConsensusTxMethod.registryRegisterNode,
  ConsensusTxMethod.registryRegisterRuntime,
  ConsensusTxMethod.registryProveFreshness,
  ConsensusTxMethod.registryUnfreezeNode,
  ConsensusTxMethod.roothashEvidence,
  ConsensusTxMethod.roothashSubmitMsg,
  ConsensusTxMethod.stakingAddEscrow,
  ConsensusTxMethod.stakingReclaimEscrow,
  ConsensusTxMethod.governanceSubmitProposal,
  ConsensusTxMethod.stakingTransfer,
  ConsensusTxMethod.beaconVRFProve,
  ConsensusTxMethod.vaultAuthorizeAction,
  ConsensusTxMethod.vaultCancelAction,
  ConsensusTxMethod.vaultCreate,
] satisfies ConsensusTxMethod[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTestExhaustiveArray =
  undefined as unknown as ConsensusTxMethod satisfies (typeof knownConsensusTxMethods)[number]

export const getConsensusTxMethodOptions = (t: TFunction) =>
  knownConsensusTxMethods.map(
    (method): ConsensusTransactionTypeFilterOption => ({
      value: method,
      label: getConsensusTransactionLabel(t, method),
    }),
  )

export const getConsensusTransactionMethodFilteringParam = (
  method: ConsensusTxMethodFilterOption,
): Partial<GetConsensusTransactionsParams> => (method === 'any' ? {} : { method })
