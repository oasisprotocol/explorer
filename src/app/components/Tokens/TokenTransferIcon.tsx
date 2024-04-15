import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import StreamIcon from '@mui/icons-material/Stream'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ApprovalIcon from '@mui/icons-material/Approval'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { MethodIcon } from '../ConsensusTransactionMethod'

const getTokenTransferLabel = (t: TFunction, name: string | undefined): string => {
  switch (name) {
    case undefined:
      return t('tokens.transferEventType.unavailable')
    case 'Transfer':
      return t('tokens.transferEventType.transfer')
    case 'Approval':
      return t('tokens.transferEventType.approval')
    case 'Minting':
      return t('tokens.transferEventType.minting')
    case 'Burning':
      return t('tokens.transferEventType.burning')
    default:
      return t('tokens.transferEventType.unknown', { name })
  }
}

const getTokenTransferIcon = (name: string | undefined, size?: number) => {
  switch (name) {
    case 'Transfer':
      return <MethodIcon border={false} color="green" icon={<ArrowForwardIcon />} size={size} />
    case 'Approval':
      return <MethodIcon color="green" border={false} icon={<ApprovalIcon />} size={size} />
    case 'Minting':
      return <MethodIcon color="green" border={false} icon={<StreamIcon />} size={size} />
    case 'Burning':
      return <MethodIcon color="orange" border={false} icon={<LocalFireDepartmentIcon />} />
    default:
      return <MethodIcon border={false} color="gray" icon={<QuestionMarkIcon />} size={size} />
  }
}

interface TokenTransferLabelProps {
  /**
   * The event name
   */
  name: string | undefined
}

export const TokenTransferLabel: FC<TokenTransferLabelProps> = ({ name }) => {
  const { t } = useTranslation()

  return <>{getTokenTransferLabel(t, name)}</>
}

interface TokenTransferIconProps extends TokenTransferLabelProps {
  size?: number
}

export const TokenTransferIcon: FC<TokenTransferIconProps> = ({ name, size }) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      arrow
      placement="top"
      title={getTokenTransferLabel(t, name)}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
    >
      <span>{getTokenTransferIcon(name, size)}</span>
    </Tooltip>
  )
}
