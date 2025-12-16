import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { DeveloperBoard } from '../MuiIcons/DeveloperBoard'
import { DeveloperBoardOff } from '../MuiIcons/DeveloperBoardOff'
import { MethodIcon } from '../ConsensusTransactionMethod'
import {
  GetRuntimeTransactionsParams,
  KnownRuntimeTxMethod,
  knownRuntimeTxMethods,
  Layer,
  RuntimeTransaction,
} from '../../../oasis-nexus/api'
import { paraTimesConfig } from '../../../config'
import { exhaustedTypeWarning } from '../../../types/errors'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'
import { ArrowRight, ArrowUp, ArrowDown, Cpu, CircleHelp, Network, Files, Lock, FileText } from 'lucide-react'

const getRuntimeTransactionLabel = (t: TFunction, method: KnownRuntimeTxMethod) => {
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

export type RuntimeTxMethodFilterOption = {
  value: RuntimeTxMethodFilteringType
  label: string
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

/**
 * The method call body. Defined by the runtime.
 *
 * May be undefined if the transaction was malformed.
 *
 * In theory, this could be any string as the runtimes evolve.
 * In practice, the nexus currently expects only KnownRuntimeTxMethod.
 */
const getRuntimeTransactionIcon = (method: KnownRuntimeTxMethod, label: string, truncate?: boolean) => {
  const props = {
    border: false,
    label,
    truncate,
  }

  switch (method) {
    case 'evm.Call':
      return <MethodIcon icon={<FileText />} {...props} />
    case 'evm.Create':
      return <MethodIcon icon={<Files />} {...props} />
    case 'consensus.Deposit':
      return <MethodIcon color="green" icon={<ArrowDown />} {...props} />
    case 'consensus.Withdraw':
      return <MethodIcon color="orange" icon={<ArrowUp />} {...props} />
    case 'consensus.Delegate':
      return <MethodIcon icon={<Network className="[&_rect]:fill-current" />} {...props} />
    case 'consensus.Undelegate':
      return <MethodIcon icon={<Network />} {...props} />
    case 'accounts.Transfer':
      return <MethodIcon color="green" icon={<ArrowRight />} {...props} />
    case 'rofl.Create':
      return <MethodIcon color="green" icon={<Cpu />} {...props} />
    case 'rofl.Register':
      return <MethodIcon icon={<Cpu />} {...props} />
    case 'rofl.Remove':
      return <MethodIcon color="orange" icon={<Cpu />} {...props} />
    case 'rofl.Update':
      return <MethodIcon color="green" icon={<Cpu />} {...props} />
    case 'roflmarket.ProviderCreate':
      return <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.ProviderUpdate':
      return <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.ProviderUpdateOffers':
      return <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.ProviderRemove':
      return <MethodIcon color="orange" icon={<DeveloperBoardOff />} {...props} />
    case 'roflmarket.InstanceCreate':
      return <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.InstanceTopUp':
      return <MethodIcon icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.InstanceCancel':
      return <MethodIcon color="orange" icon={<DeveloperBoardOff />} {...props} />
    case 'roflmarket.InstanceExecuteCmds':
      return <MethodIcon icon={<DeveloperBoard />} {...props} />
    case 'roflmarket.InstanceChangeAdmin':
      return <MethodIcon icon={<DeveloperBoard />} {...props} />
    case '':
      // Method may be empty if the transaction was malformed, or encrypted (oasis_encryption_envelope).
      // TODO: differentiate malformed and encrypted
      return <MethodIcon color="green" icon={<Lock />} {...props} />
    default:
      exhaustedTypeWarning('Unknown runtime tx method', method)
      return <MethodIcon color="gray" icon={<CircleHelp />} {...props} />
  }
}

type RuntimeTransactionLabelProps = {
  transaction: RuntimeTransaction
  truncate?: boolean
}

export const RuntimeTransactionMethod: FC<RuntimeTransactionLabelProps> = ({ transaction, truncate }) => {
  const { t } = useTranslation()
  let label = getRuntimeTransactionLabel(t, transaction.method as KnownRuntimeTxMethod)
  if (transaction.evm_fn_name) {
    if (truncate) {
      label = `${transaction.evm_fn_name}`
    } else {
      label += `: ${transaction.evm_fn_name}`
    }
  }

  return <>{getRuntimeTransactionIcon(transaction.method as KnownRuntimeTxMethod, label, truncate)}</>
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
