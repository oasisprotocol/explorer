import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { ProposalState } from '../../../oasis-nexus/api'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 3,
  flex: 1,
  borderRadius: 10,
  padding: theme.spacing(2, 2, 2, '10px'),
  fontSize: '12px',
  minWidth: '85px',
}))

const StyledIcon = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
})

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
    <StyledBox sx={{ backgroundColor: statusConfig.backgroundColor, color: statusConfig.textColor }}>
      {statusConfig.label}
      <StyledIcon sx={{ color: statusConfig.iconColor }}>
        <IconComponent color="inherit" fontSize="inherit" />
      </StyledIcon>
    </StyledBox>
  )
}
