import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

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
    default:
      return t('transactions.method.unknown', { method })
  }
}

type RuntimeTransactionLabelProps = {
  /**
   * The method call body. Defined by the runtime.
   *
   * May be undefined if the transaction was malformed.
   *
   * In theory, this could be any string as the runtimes evolve.
   * In practice, the indexer currently expects only the following methods:
   *   - "accounts.Transfer"
   *   - "consensus.Deposit"
   *   - "consensus.Withdraw"
   *   - "evm.Create"
   *   - "evm.Call"
   */
  method?: string
}

export const RuntimeTransactionLabel: FC<RuntimeTransactionLabelProps> = ({ method }) => {
  const { t } = useTranslation()

  return <>{getRuntimeTransactionLabel(t, method)}</>
}
