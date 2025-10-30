import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/Lock'
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred'
import { COLORS } from '../../../styles/theme/colors'
import { RuntimeTransactionEncryptionEnvelope } from '../../../oasis-nexus/api'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'

type TransactionEncryptionStatusProps = {
  envelope?: RuntimeTransactionEncryptionEnvelope
  withText?: boolean
}

export const TransactionEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('transaction.tooltips.txEncrypted')}>
      <LockIcon htmlColor={COLORS.eucalyptus} />
    </Tooltip>
  )
}

export const TransactionNotEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={<Trans t={t} i18nKey="transaction.tooltips.txNotEncrypted" />}>
      <NoEncryptionGmailerrorredIcon htmlColor={COLORS.grayMedium2} />
    </Tooltip>
  )
}

export const TransactionEncryptionStatus: FC<TransactionEncryptionStatusProps> = ({ envelope, withText }) => {
  const { t } = useTranslation()
  return envelope ? (
    <>
      {withText && <>{envelope.format} &nbsp;</>}
      <TransactionEncrypted />
    </>
  ) : (
    <>
      {withText && <>{t('transactions.encryption.plain')} &nbsp;</>}
      <TransactionNotEncrypted />
    </>
  )
}
