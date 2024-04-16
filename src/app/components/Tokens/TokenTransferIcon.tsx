import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
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
      return name || t('common.unknown')
  }
}

const getTokenTransferIcon = (
  name: string | undefined,
  label: string,
  reverseLabel?: boolean,
  size?: number,
) => {
  const props = {
    border: false,
    label,
    reverseLabel,
    size,
  }

  switch (name) {
    case 'Transfer':
      return <MethodIcon color="green" icon={<ArrowForwardIcon />} {...props} />
    case 'Approval':
      return <MethodIcon color="green" icon={<ApprovalIcon />} {...props} />
    case 'Minting':
      return <MethodIcon color="green" icon={<StreamIcon />} {...props} />
    case 'Burning':
      return <MethodIcon color="orange" icon={<LocalFireDepartmentIcon />} {...props} />
    default:
      return <MethodIcon color="gray" icon={<QuestionMarkIcon />} {...props} />
  }
}

interface TokenTransferIconProps {
  method: string | undefined
  reverseLabel?: boolean
  size?: number
}

export const TokenTransferIcon: FC<TokenTransferIconProps> = ({ method, reverseLabel, size }) => {
  const { t } = useTranslation()
  const label = getTokenTransferLabel(t, method)

  return <>{getTokenTransferIcon(method, label, reverseLabel, size)}</>
}
