import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import AlarmIcon from '@mui/icons-material/Alarm'
import { COLORS } from '../../../styles/theme/colors'
import { COLORS as TESTNET_COLORS } from '../../../styles/theme/testnet/colors'
import { Badge } from '../../components/Badge'

type RuntimeStatusIconProps = {
  status: 'stable' | 'outdated' | 'inactive'
}

const getStatuses = (t: TFunction) => ({
  stable: {
    backgroundColor: COLORS.honeydew,
    icon: CheckCircleIcon,
    iconColor: COLORS.eucalyptus,
    label: t('common.online'),
  },
  outdated: {
    backgroundColor: TESTNET_COLORS.testnetLight,
    icon: WarningIcon,
    iconColor: TESTNET_COLORS.testnet,
    label: t('paratimes.outdated'),
  },
  inactive: {
    backgroundColor: COLORS.brandLightBlue,
    icon: AlarmIcon,
    iconColor: COLORS.brandMedium,
    label: t('paratimes.inactive'),
  },
})

export const RuntimeStatusIcon: FC<RuntimeStatusIconProps> = ({ status }) => {
  const { t } = useTranslation()
  const statusConfig = getStatuses(t)[status]
  const IconComponent = statusConfig.icon

  return (
    <Badge
      backgroundColor={statusConfig.backgroundColor}
      textColor={COLORS.grayExtraDark}
      label={statusConfig.label}
      icon={<IconComponent sx={{ color: statusConfig.iconColor }} fontSize="inherit" />}
    />
  )
}
