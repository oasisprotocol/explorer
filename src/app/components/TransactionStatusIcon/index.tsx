import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { Help } from '@mui/icons-material'

type TxStatus = 'unknown' | 'success' | 'failure'

const statusBgColor: Record<TxStatus, string> = {
  unknown: COLORS.grayMediumLight,
  success: COLORS.honeydew,
  failure: COLORS.linen,
}

const statusFgColor: Record<TxStatus, string> = {
  unknown: COLORS.grayMedium,
  success: COLORS.eucalyptus,
  failure: COLORS.errorIndicatorBackground,
}

const statusIcon: Record<TxStatus, () => ReactNode> = {
  unknown: () => <Help color={'inherit'} fontSize="inherit" />,
  success: () => <CheckCircleIcon color="success" fontSize="inherit" />,
  failure: () => <CancelIcon color="error" fontSize="inherit" />,
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'success' && prop !== 'withText',
})(({ success, withText }: TransactionStatusIconProps) => {
  const status: TxStatus = success === undefined ? 'unknown' : success ? 'success' : 'failure'

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: withText ? undefined : '28px',
    height: '28px',
    fontSize: '15px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 12,
    paddingRight: 12,
  }
})

type TransactionStatusIconProps = {
  /**
   * Did the transaction succeed?
   * A missing value means unknown. (For encrypted transactions).
   */
  success?: boolean
  withText?: boolean
}

export const TransactionStatusIcon: FC<TransactionStatusIconProps> = ({ success, withText }) => {
  const { t } = useTranslation()
  const status: TxStatus = success === undefined ? 'unknown' : success ? 'success' : 'failure'
  const statusLabel: Record<TxStatus, string> = {
    unknown: t('common.unknown'),
    success: t('common.success'),
    failure: t('common.failed'),
  }

  return (
    <StyledBox success={success} withText={withText}>
      {withText && (
        <span>
          {statusLabel[status]}
          &nbsp;
        </span>
      )}
      {statusIcon[status]()}
    </StyledBox>
  )
}
