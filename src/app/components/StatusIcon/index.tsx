import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { COLORS } from '../../../styles/theme/colors'
import HelpIcon from '@mui/icons-material/Help'
import LockIcon from '@mui/icons-material/Lock'
import { TxError } from '../../../oasis-nexus/api'
import Tooltip from '@mui/material/Tooltip'
import { useTxErrorMessage } from '../../hooks/useTxErrorMessage'
import { TFunction } from 'i18next'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

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
  unknown: <LockIcon color="inherit" fontSize="inherit" />,
  success: <CheckCircleIcon color="inherit" fontSize="inherit" />,
  partialsuccess: <CheckCircleIcon color="success" fontSize="inherit" />,
  failure: <CancelIcon color="error" fontSize="inherit" />,
  pending: <HelpIcon color="inherit" fontSize="inherit" />,
}

interface StatusBadgeProps {
  status: TxStatus
  children: ReactNode
  withText?: boolean
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, children, withText }) => (
  <div
    className={cn(
      'flex justify-center items-center text-sm rounded-lg',
      withText ? 'px-3 py-1' : 'w-7 min-h-7 p-1',
    )}
    style={{
      backgroundColor: statusBgColor[status],
      color: statusFgColor[status],
    }}
  >
    {children}
  </div>
)

interface StatusDetailsProps {
  error?: boolean
  children: ReactNode
}

export const StatusDetails: FC<StatusDetailsProps> = ({ error, children }) => (
  <div
    className="flex justify-center items-center min-h-7 text-xs rounded-lg px-3 break-all bg-gray-200"
    style={{
      color: error ? COLORS.errorIndicatorBackground : COLORS.warningColor,
    }}
  >
    {children}
  </div>
)

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
        <div
          className={cn(
            'flex justify-center items-center text-sm rounded-lg',
            withText ? 'px-3 py-1' : 'w-7 min-h-7 p-1',
          )}
          style={{
            backgroundColor: statusBgColor[status],
            color: statusFgColor[status],
          }}
        >
          {statusLabel[status]}
          &nbsp;
          {statusIcon[status]}
        </div>
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
        <StatusBadge status={status} withText={withText}>
          {statusIcon[status]}
        </StatusBadge>
      </Tooltip>
    )
  }
}
