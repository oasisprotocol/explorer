import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { UnknownIcon } from './../CustomIcons/Unknown'
import { ContractCreationIcon } from './../CustomIcons/ContractCreation'
import { ContractCallIcon } from './../CustomIcons/ContractCall'
import { DepositIcon } from './../CustomIcons/Deposit'
import { WithdrawIcon } from './../CustomIcons/Withdraw'
import { TransferIcon } from './../CustomIcons/Transfer'
import { DelegateIcon } from '../CustomIcons/Delegate'
import { UndelegateStartIcon } from '../CustomIcons/UndelegateStart'

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
      return t('transactions.method.unknown', { method })
  }
}

const iconStyles = { fontSize: '40px' }
const getRuntimeTransactionIcon = (method: string | undefined) => {
  switch (method) {
    case undefined:
      // Method may be undefined if the transaction was malformed.
      return <UnknownIcon sx={iconStyles} />
    case 'evm.Call':
      return <ContractCallIcon sx={iconStyles} />
    case 'evm.Create':
      return <ContractCreationIcon sx={iconStyles} />
    case 'consensus.Deposit':
      return <DepositIcon sx={iconStyles} />
    case 'consensus.Withdraw':
      return <WithdrawIcon sx={iconStyles} />
    case 'consensus.Delegate':
      return <DelegateIcon sx={iconStyles} />
    case 'consensus.Undelegate':
      return <UndelegateStartIcon sx={iconStyles} />
    case 'accounts.Transfer':
      return <TransferIcon sx={iconStyles} />
    default:
      return <UnknownIcon sx={iconStyles} />
  }
}

type RuntimeTransactionLabelProps = {
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
  method?: string
}

export const RuntimeTransactionLabel: FC<RuntimeTransactionLabelProps> = ({ method }) => {
  const { t } = useTranslation()

  return <>{getRuntimeTransactionLabel(t, method)}</>
}

export const RuntimeTransactionIcon: FC<RuntimeTransactionLabelProps> = ({ method }) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      arrow
      placement="top"
      title={getRuntimeTransactionLabel(t, method)}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
    >
      <span>{getRuntimeTransactionIcon(method)}</span>
    </Tooltip>
  )
}
