import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { ArrowRight, Flame, CircleHelp, Stamp } from 'lucide-react'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { Stream } from '../MuiIcons/Stream'

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
      return <MethodIcon color="green" icon={<ArrowRight />} {...props} />
    case 'Approval':
      return <MethodIcon color="green" icon={<Stamp />} {...props} />
    case 'Minting':
      return <MethodIcon color="green" icon={<Stream />} {...props} />
    case 'Burning':
      return <MethodIcon color="orange" icon={<Flame />} {...props} />
    default:
      return <MethodIcon color="gray" icon={<CircleHelp />} {...props} />
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
