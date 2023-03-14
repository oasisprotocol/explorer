import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

enum RuntimeTransactionMethod {
  Call = 'evm.Call',
  Create = 'evm.Create',
  Deposit = 'consensus.Deposit',
  Withdraw = 'consensus.Withdraw',
}

const getRuntimeTransactionLabel = (t: TFunction, method: string) => {
  switch (method) {
    case RuntimeTransactionMethod.Call:
      return t('transactions.method.evm.call')
    case RuntimeTransactionMethod.Create:
      return t('transactions.method.evm.create')
    case RuntimeTransactionMethod.Deposit:
      return t('transactions.method.consensus.deposit')
    case RuntimeTransactionMethod.Withdraw:
      return t('transactions.method.consensus.withdraw')
    default:
      return ''
  }
}

type RuntimeTransactionLabelProps = {
  method: string // RuntimeTransaction method type is not yet defined in API
}

export const RuntimeTransactionLabel: FC<RuntimeTransactionLabelProps> = ({ method }) => {
  const { t } = useTranslation()

  return <>{getRuntimeTransactionLabel(t, method)}</>
}
