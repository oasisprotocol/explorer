import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@oasisprotocol/ui-library/src/components/alert'

type MultipleTransactionsWarningProps = {
  enable: boolean | undefined
}

export const MultipleTransactionsWarning: FC<MultipleTransactionsWarningProps> = ({ enable }) => {
  const { t } = useTranslation()

  if (!enable) {
    return null
  }

  return (
    <Alert variant="error" className="mb-4">
      {t('transaction.warningMultipleTransactionsSameHash')}
    </Alert>
  )
}
