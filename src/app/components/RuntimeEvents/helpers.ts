import { TFunction } from 'i18next'
import { RuntimeEventType } from 'oasis-nexus/api'
import { exhaustedTypeWarning } from 'types/errors'

export const getRuntimeEventMethodLabel = (t: TFunction, method: RuntimeEventType | undefined) => {
  switch (method) {
    case RuntimeEventType.accountstransfer:
      return t('runtimeEvent.accountstransfer')
    case RuntimeEventType.evmlog:
      return t('runtimeEvent.evmLog')
    case RuntimeEventType.coregas_used:
      return t('runtimeEvent.gasUsed')
    case RuntimeEventType.consensus_accountswithdraw:
      return t('runtimeEvent.consensusWithdrawal')
    case RuntimeEventType.consensus_accountsdeposit:
      return t('runtimeEvent.consensusDeposit')
    case RuntimeEventType.consensus_accountsdelegate:
      return t('runtimeEvent.consensusDelegate')
    case RuntimeEventType.consensus_accountsundelegate_start:
      return t('runtimeEvent.consensusUndelegateStart')
    case RuntimeEventType.consensus_accountsundelegate_done:
      return t('runtimeEvent.consensusUndelegateDone')
    case RuntimeEventType.accountsmint:
      return t('runtimeEvent.accountsmint')
    case RuntimeEventType.accountsburn:
      return t('runtimeEvent.accountsburn')
    case RuntimeEventType.roflapp_created:
      return t('runtimeEvent.roflAppCreated')
    case RuntimeEventType.roflapp_updated:
      return t('runtimeEvent.roflAppUpdated')
    case RuntimeEventType.roflapp_removed:
      return t('runtimeEvent.roflAppRemoved')
    case RuntimeEventType.roflinstance_registered:
      return t('runtimeEvent.replicaRegistered')
    case RuntimeEventType.roflmarketprovider_created:
      return t('runtimeEvent.roflmarketProviderCreated')
    case RuntimeEventType.roflmarketprovider_updated:
      return t('runtimeEvent.roflmarketProviderUpdated')
    case RuntimeEventType.roflmarketprovider_removed:
      return t('runtimeEvent.roflmarketProviderRemoved')
    case RuntimeEventType.roflmarketinstance_created:
      return t('runtimeEvent.roflmarketMachineCreated')
    case RuntimeEventType.roflmarketinstance_updated:
      return t('runtimeEvent.roflmarketMachineUpdated')
    case RuntimeEventType.roflmarketinstance_accepted:
      return t('runtimeEvent.roflmarketMachineAccepted')
    case RuntimeEventType.roflmarketinstance_cancelled:
      return t('runtimeEvent.roflmarketMachineCancelled')
    case RuntimeEventType.roflmarketinstance_removed:
      return t('runtimeEvent.roflmarketMachineRemoved')
    case RuntimeEventType.roflmarketinstance_command_queued:
      return t('runtimeEvent.roflmarketMachineCommandQueued')

    case undefined:
      return t('common.unknown')
    default:
      exhaustedTypeWarning('Unexpected event type', method)
      return method || t('common.unknown')
  }
}
