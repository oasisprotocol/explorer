import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import HelpIcon from '@mui/icons-material/Help'
import { TxError } from '../../../oasis-nexus/api'
import Tooltip from '@mui/material/Tooltip'
import { useTxErrorMessage } from '../../hooks/useTxErrorMessage'
import { TFunction } from 'i18next'

type TxStatus = 'unknown' | 'success' | 'partialsuccess' | 'failure' | 'pending'

const statusBgColor: Record<TxStatus, string> = {
  unknown: COLORS.grayMediumLight,
  success: COLORS.eucalyptus,
  partialsuccess: COLORS.honeydew,
  failure: COLORS.linen,
  pending: COLORS.warningLight,
}

const statusFgColor: Record<TxStatus, string> = {
  unknown: COLORS.grayMedium,
  success: COLORS.honeydew,
  partialsuccess: COLORS.eucalyptus,
  failure: COLORS.errorIndicatorBackground,
  pending: COLORS.warningColor,
}

export const statusIcon: Record<TxStatus, ReactNode> = {
  unknown: <HelpIcon color="inherit" fontSize="inherit" />,
  success: <CheckCircleIcon color="inherit" fontSize="inherit" />,
  partialsuccess: <CheckCircleIcon color="success" fontSize="inherit" />,
  failure: <CancelIcon color="error" fontSize="inherit" />,
  pending: <HelpIcon color="inherit" fontSize="inherit" />,
}

type StyledBoxProps = {
  status: TxStatus
  withText?: boolean
}

export const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'status' && prop !== 'withText',
})(({ status, withText }: StyledBoxProps) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: withText ? undefined : '28px',
    minHeight: '28px',
    fontSize: '15px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 12,
    paddingRight: 12,
  }
})

export const StatusDetails = styled(Box, {
  shouldForwardProp: prop => prop !== 'error',
})(({ error }: { error?: boolean }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '28px',
  fontSize: '12px',
  backgroundColor: COLORS.grayLight,
  color: error ? COLORS.errorIndicatorBackground : COLORS.warningColor,
  borderRadius: 10,
  paddingLeft: 12,
  paddingRight: 12,
  wordBreak: 'break-all',
}))

type StatusIconProps = {
  /**
   * Did the transaction succeed?
   * A missing value means unknown. (For encrypted transactions).
   */
  success: undefined | boolean
  error: undefined | TxError
  withText?: boolean
  method?: string
}

const isRuntimeConsensusTxMethod = (method?: string) => {
  const methods = ['consensus.Deposit', 'consensus.Withdraw', 'consensus.Delegate', 'consensus.Undelegate']
  return method && methods.includes(method)
}

const pendingMethodLabels = {
  'consensus.Deposit': 'transaction.deposit',
  'consensus.Withdraw': 'transaction.withdraw',
  'consensus.Delegate': 'transaction.delegate',
  'consensus.Undelegate': 'transaction.undelegate',
} as const

const getPendingLabel = (t: TFunction, method: string | undefined, withText?: boolean) => {
  if (withText) {
    return t('transaction.started')
  }
  const translationKey = pendingMethodLabels[method as keyof typeof pendingMethodLabels]
  const translatedMethod = translationKey ? t(translationKey) : method
  return t('transaction.startedDescription', { method: translatedMethod })
}

export const StatusIcon: FC<StatusIconProps> = ({ success, error, withText, method }) => {
  const { t } = useTranslation()
  const status: TxStatus =
    success === undefined
      ? isRuntimeConsensusTxMethod(method)
        ? 'pending'
        : 'unknown'
      : success
        ? 'success'
        : 'failure'
  const statusLabel: Record<TxStatus, string> = {
    unknown: t('common.unknown'),
    success: t('common.success'),
    partialsuccess: t('common.partial_success'),
    failure: t('common.failed'),
    pending: getPendingLabel(t, method, withText),
  }
  const errorMessage = useTxErrorMessage(error)

  if (withText) {
    return (
      <>
        <StyledBox status={status} withText={withText}>
          {statusLabel[status]}
          &nbsp;
          {statusIcon[status]}
        </StyledBox>
        {errorMessage && <StatusDetails error>{errorMessage}</StatusDetails>}
        {!errorMessage && status === 'pending' && <StatusDetails>{getPendingLabel(t, method)}</StatusDetails>}
      </>
    )
  } else {
    return (
      <Tooltip
        arrow
        placement="top"
        title={errorMessage ? `${statusLabel[status]}: ${errorMessage}` : statusLabel[status]}
      >
        <StyledBox status={status} withText={withText}>
          {statusIcon[status]}
        </StyledBox>
      </Tooltip>
    )
  }
}
