import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/Lock'
import { COLORS } from '../../../styles/theme/colors'
import { RuntimeTransactionEncryptionEnvelope } from '../../../oasis-indexer/api'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'

type TransactionEncryptionStatusProps = {
  envelope?: RuntimeTransactionEncryptionEnvelope
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

export const TransactionEncryptionStatus: FC<TransactionEncryptionStatusProps> = ({ envelope }) =>
  envelope ? <TransactionEncrypted /> : null
