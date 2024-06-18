import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/Lock'
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred'
import { COLORS } from '../../../styles/theme/colors'
import { RuntimeTransactionEncryptionEnvelope } from '../../../oasis-nexus/api'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'

type TransactionEncryptionStatusProps = {
  envelope?: RuntimeTransactionEncryptionEnvelope
  withText?: boolean
}

export const TransactionEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip
      arrow
      placement="top"
      title={t('transaction.tooltips.txEncrypted')}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
    >
      <LockIcon htmlColor={COLORS.eucalyptus} />
    </Tooltip>
  )
}

export const TransactionNotEncrypted = () => {
  const { t } = useTranslation()
  return (
    <Tooltip
      arrow
      placement="top"
      title={<Trans t={t} i18nKey="transaction.tooltips.txNotEncrypted" />}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
    >
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
