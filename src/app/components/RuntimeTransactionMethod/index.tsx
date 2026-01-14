import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DeveloperBoard } from '../MuiIcons/DeveloperBoard'
import { DeveloperBoardOff } from '../MuiIcons/DeveloperBoardOff'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { KnownRuntimeTxMethod, RuntimeTransaction } from '../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../types/errors'
import { ArrowRight, ArrowUp, ArrowDown, Cpu, CircleHelp, Network, Files, Lock, FileText } from 'lucide-react'
import { getRuntimeTransactionLabel } from './helpers'

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
