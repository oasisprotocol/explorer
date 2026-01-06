import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { TxError } from '../../../oasis-nexus/api'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { useTxErrorMessage } from '../../hooks/useTxErrorMessage'
import { TFunction } from 'i18next'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { CircleCheck, CircleX, CircleHelp, Clock } from 'lucide-react'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { AdvancedField } from '../AdvancedField/AdvancedField'

type TxStatus = 'unknown' | 'success' | 'failure' | 'pending'

const statusBgColor: Record<TxStatus, string> = {
  unknown: 'bg-zinc-500',
  success: 'bg-success',
  failure: 'bg-destructive',
  pending: 'bg-zinc-500',
}

const statusIcon = (status: TxStatus, size: number, withText?: boolean): ReactNode => {
  // [&_circle]:stroke-transparent fixes background animation on new transactions
  const strokeClass = withText ? 'stroke-background' : '[&_circle]:stroke-transparent'

  switch (status) {
    case 'unknown':
      return <CircleHelp size={size} className={cn('fill-zinc-500', strokeClass)} />
    case 'success':
      return <CircleCheck size={size} className={cn('fill-success', strokeClass)} />
    case 'failure':
      return <CircleX size={size} className={cn('fill-destructive', strokeClass)} />
    case 'pending':
      return <Clock size={size} className={cn('fill-zinc-500', strokeClass)} />
  }
}

interface StatusBadgeProps {
  status: TxStatus
  children: ReactNode
  withText?: boolean
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, children, withText }) => (
  <div
    className={cn(
      'flex justify-center items-center text-sm rounded-lg text-background',
      withText ? 'px-3 py-1' : 'p-0',
      withText && statusBgColor[status],
    )}
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

const getUnknownLabel = (t: TFunction, withText?: boolean) => {
  if (withText) {
    return t('common.unknown')
  }
  return t('transaction.tooltips.statusEncrypted')
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
    unknown: getUnknownLabel(t, withText),
    success: t('common.success'),
    failure: t('common.failed'),
    pending: getPendingLabel(t, method, withText),
  }
  const { errorMessage, decode4BytesErrorLink } = useTxErrorMessage(error)
  const iconSize = withText ? 16 : 20

  if (withText) {
    return (
      <>
        <div
          className={cn(
            'flex justify-center items-center text-sm rounded-full text-background gap-2',
            withText ? 'px-4 py-0.5' : 'w-7 min-h-7 p-1',
            withText && statusBgColor[status],
          )}
        >
          {statusLabel[status]}
          {statusIcon(status, iconSize, withText)}
        </div>
        {errorMessage && (
          <>
            <StatusDetails error>{errorMessage} </StatusDetails>
            {decode4BytesErrorLink && (
              <AdvancedField>
                <Link href={decode4BytesErrorLink} rel="noopener noreferrer" target="_blank">
                  {t('errors.attemptToDecode4Bytes')}
                </Link>
              </AdvancedField>
            )}
          </>
        )}
        {!errorMessage && status === 'pending' && <StatusDetails>{getPendingLabel(t, method)}</StatusDetails>}
        {status === 'unknown' && <StatusDetails>{getUnknownLabel(t)}</StatusDetails>}
      </>
    )
  } else {
    return (
      <Tooltip title={errorMessage ? `${statusLabel[status]}: ${errorMessage}` : statusLabel[status]}>
        <div>
          <StatusBadge status={status} withText={withText}>
            {statusIcon(status, iconSize, withText)}
          </StatusBadge>
        </div>
      </Tooltip>
    )
  }
}
