import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { RuntimeTransactionEncryptionEnvelope } from '../../../oasis-nexus/api'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { LockKeyhole, LockOpen } from 'lucide-react'

type TransactionEncryptionStatusProps = {
  envelope?: RuntimeTransactionEncryptionEnvelope
  withText?: boolean
}

export const TransactionEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('transaction.tooltips.txEncrypted')}>
      <LockKeyhole size="16" className="stroke-success" />
    </Tooltip>
  )
}

export const TransactionNotEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={<Trans t={t} i18nKey="transaction.tooltips.txNotEncrypted" />}>
      <LockOpen size="16" className="stroke-zinc-500" />
    </Tooltip>
  )
}

export const TransactionEncryptionStatus: FC<TransactionEncryptionStatusProps> = ({ envelope, withText }) => {
  const { t } = useTranslation()
  return envelope ? (
    <div className="flex justify-center items-center">
      {withText && <>{envelope.format} &nbsp;</>}
      <TransactionEncrypted />
    </div>
  ) : (
    <div className="flex justify-center items-center">
      {withText && <>{t('transactions.encryption.plain')} &nbsp;</>}
      <TransactionNotEncrypted />
    </div>
  )
}
