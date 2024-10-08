import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import LanIcon from '@mui/icons-material/Lan'
import LanOutlinedIcon from '@mui/icons-material/LanOutlined'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { RuntimeTransaction } from '../../../oasis-nexus/api'

const getRuntimeTransactionLabel = (t: TFunction, method: string | undefined) => {
  switch (method) {
    case undefined:
      // Method may be undefined if the transaction was malformed.
      return t('transactions.method.unavailable')
    case 'evm.Call':
      return t('transactions.method.evm.call')
    case 'evm.Create':
      return t('transactions.method.evm.create')
    case 'consensus.Deposit':
      return t('transactions.method.consensus.deposit')
    case 'consensus.Withdraw':
      return t('transactions.method.consensus.withdraw')
    case 'accounts.Transfer':
      return t('transactions.method.accounts.transfer')
    case 'consensus.Delegate':
      return t('transactions.method.consensus.delegate')
    case 'consensus.Undelegate':
      return t('transactions.method.consensus.undelegate')
    default:
      return method || t('common.unknown')
  }
}

/**
 * The method call body. Defined by the runtime.
 *
 * May be undefined if the transaction was malformed.
 *
 * In theory, this could be any string as the runtimes evolve.
 * In practice, the nexus currently expects only the following methods:
 *   - "accounts.Transfer"
 *   - "consensus.Deposit"
 *   - "consensus.Withdraw"
 *   - "consensus.Delegate"
 *   - "consensus.Undelegate"
 *   - "evm.Create"
 *   - "evm.Call"
 */
const getRuntimeTransactionIcon = (method: string | undefined, label: string, truncate?: boolean) => {
  const props = {
    border: false,
    label,
    truncate,
  }

  switch (method) {
    case 'evm.Call':
      return <MethodIcon icon={<TextSnippetIcon />} {...props} />
    case 'evm.Create':
      return <MethodIcon icon={<FileCopyIcon />} {...props} />
    case 'consensus.Deposit':
      return <MethodIcon color="green" icon={<ArrowDownwardIcon />} {...props} />
    case 'consensus.Withdraw':
      return <MethodIcon color="orange" icon={<ArrowUpwardIcon />} {...props} />
    case 'consensus.Delegate':
      return <MethodIcon icon={<LanIcon />} {...props} />
    case 'consensus.Undelegate':
      return <MethodIcon icon={<LanOutlinedIcon />} {...props} />
    case 'accounts.Transfer':
      return <MethodIcon color="green" icon={<ArrowForwardIcon />} {...props} />
    default:
      return <MethodIcon color="gray" icon={<QuestionMarkIcon />} {...props} />
  }
}

type RuntimeTransactionLabelProps = {
  transaction: RuntimeTransaction
  truncate?: boolean
}

export const RuntimeTransactionMethod: FC<RuntimeTransactionLabelProps> = ({ transaction, truncate }) => {
  const { t } = useTranslation()
  let label = getRuntimeTransactionLabel(t, transaction.method)
  if (transaction.evm_fn_name) {
    if (truncate) {
      label = `${transaction.evm_fn_name}`
    } else {
      label += `: ${transaction.evm_fn_name}`
    }
  }

  return <>{getRuntimeTransactionIcon(transaction.method, label, truncate)}</>
}
