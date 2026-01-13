import { paraTimesConfig } from 'config'
import { TFunction } from 'i18next'
import {
  Layer,
  knownRuntimeTxMethods,
  KnownRuntimeTxMethod,
  GetRuntimeTransactionsParams,
} from 'oasis-nexus/api'
import { exhaustedTypeWarning } from 'types/errors'
import { RuntimeTxMethodFilterOption } from './types'

export const getRuntimeTransactionLabel = (t: TFunction, method: KnownRuntimeTxMethod) => {
  // TODO: when adding new types here, please also update knownRuntimeTxMethods below.
  switch (method) {
    case '':
      // Method may be empty if the transaction was malformed, or encrypted (oasis_encryption_envelope).
      // TODO: differentiate malformed and encrypted
      return t('common.unknown')
    case 'accounts.Transfer':
      return t('transactions.method.accounts.transfer')
    case 'evm.Call':
      return t('transactions.method.evm.call')
    case 'evm.Create':
      return t('transactions.method.evm.create')
    case 'consensus.Deposit':
      return t('transactions.method.consensus.deposit')
    case 'consensus.Withdraw':
      return t('transactions.method.consensus.withdraw')
    case 'consensus.Delegate':
      return t('transactions.method.consensus.delegate')
    case 'consensus.Undelegate':
      return t('transactions.method.consensus.undelegate')
    case 'rofl.Create':
      return t('transactions.method.rofl.create')
    case 'rofl.Register':
      return t('transactions.method.rofl.register')
    case 'rofl.Remove':
      return t('transactions.method.rofl.remove')
    case 'rofl.Update':
      return t('transactions.method.rofl.update')
    case 'roflmarket.ProviderCreate':
      return t('transactions.method.roflmarket.providerCreate')
    case 'roflmarket.ProviderUpdate':
      return t('transactions.method.roflmarket.providerUpdate')
    case 'roflmarket.ProviderUpdateOffers':
      return t('transactions.method.roflmarket.providerUpdateOffers')
    case 'roflmarket.ProviderRemove':
      return t('transactions.method.roflmarket.providerRemove')
    case 'roflmarket.InstanceCreate':
      return t('transactions.method.roflmarket.machineCreate')
    case 'roflmarket.InstanceTopUp':
      return t('transactions.method.roflmarket.machineTopUp')
    case 'roflmarket.InstanceCancel':
      return t('transactions.method.roflmarket.machineCancel')
    case 'roflmarket.InstanceExecuteCmds':
      return t('transactions.method.roflmarket.machineExecuteCmds')
    case 'roflmarket.InstanceChangeAdmin':
      return t('transactions.method.roflmarket.machineChangeAdmin')
    default:
      exhaustedTypeWarning('Unknown runtime tx method', method)
      return method || t('common.unknown')
  }
}

export const getRuntimeTxMethodOptions = (t: TFunction, layer: Layer) => {
  const hasRofl = !!paraTimesConfig[layer]?.offerRoflTxTypes
  return knownRuntimeTxMethods
    .filter(method => !method.startsWith('rofl') || hasRofl)
    .map(
      (method): RuntimeTxMethodFilterOption => ({
        value: method,
        label: getRuntimeTransactionLabel(t, method),
      }),
    )
}

export const getRuntimeRoflUpdatesMethodOptions = (t: TFunction) => {
  const options = ['rofl.Create', 'rofl.Remove', 'rofl.Update'] satisfies KnownRuntimeTxMethod[]

  return options.map(
    (method): RuntimeTxMethodFilterOption => ({
      value: method,
      label: getRuntimeTransactionLabel(t, method),
    }),
  )
}

export const getRuntimeTransactionMethodFilteringParam = (
  method: string,
): Partial<GetRuntimeTransactionsParams> => {
  switch (method) {
    case 'any':
      return {}
    case 'accounts.Transfer':
      // Searching for transfers is tricky, because there are some
      // transactions which are in fact evm.Calls, but are still
      // considered to be transfers based on some heuristics.
      // The Nexus API provides a special value in order to allow searching
      // for them. Their documentation says:
      //
      // 'native_transfers': Returns transactions "likely to be native transfers".
      // These include accounts.Transfer transactions and evm.Calls with an empty 'body' field.
      //
      // For more details, see the API spec at
      // https://github.com/oasisprotocol/nexus/blob/main/api/spec/v1.yaml
      return { method: 'native_transfers' }
    case 'evm.Call':
      // Searching for contract calls is tricky, because some of them
      // should be classified as transfers. (See above.)
      // The Nexus API provides a special value for excluding these
      // from the search. Their documentation says:
      //
      // 'evm.Call_no_native': Returns EVM calls that are "not likely to be native transfers".
      //
      // For more details, see the API spec at
      // https://github.com/oasisprotocol/nexus/blob/main/api/spec/v1.yaml
      return { method: 'evm.Call_no_native' }
    default:
      // For other (normal) methods, we can simply pass on the wanted method name.
      return { method }
  }
}
