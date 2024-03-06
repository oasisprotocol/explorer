import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { COLORS } from '../../../styles/theme/colors'
import { ProposalState } from '../../../oasis-nexus/api'
import { Badge } from '../../components/Badge'

const getStatuses = (t: TFunction) => ({
  [ProposalState.active]: {
    backgroundColor: COLORS.honeydew,
    icon: CheckCircleIcon,
    iconColor: COLORS.eucalyptus,
    label: t('networkProposal.state.active'),
    textColor: COLORS.grayExtraDark,
  },
  [ProposalState.passed]: {
    backgroundColor: COLORS.eucalyptus,
    icon: CheckCircleIcon,
    iconColor: COLORS.honeydew,
    label: t('networkProposal.state.passed'),
    textColor: COLORS.white,
  },
  [ProposalState.rejected]: {
    backgroundColor: COLORS.errorIndicatorBackground,
    icon: CancelIcon,
    iconColor: COLORS.linen,
    label: t('networkProposal.state.rejected'),
    textColor: COLORS.white,
  },
  [ProposalState.failed]: {
    backgroundColor: COLORS.linen,
    icon: CancelIcon,
    iconColor: COLORS.errorIndicatorBackground,
    label: t('networkProposal.state.failed'),
    textColor: COLORS.grayExtraDark,
  },
})

type ProposalStatusIconProps = {
  status: ProposalState
}

export const ProposalStatusIcon: FC<ProposalStatusIconProps> = ({ status }) => {
  const { t } = useTranslation()

  if (!ProposalState[status]) {
    return null
  }

  const statusConfig = getStatuses(t)[status]
  const IconComponent = statusConfig.icon

  return (
    <Badge
      backgroundColor={statusConfig.backgroundColor}
      textColor={statusConfig.textColor}
      label={statusConfig.label}
      icon={<IconComponent sx={{ color: statusConfig.iconColor }} fontSize="inherit" />}
    />
  )
}
