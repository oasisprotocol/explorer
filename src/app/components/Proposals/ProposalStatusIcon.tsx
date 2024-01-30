import { FC } from 'react'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { ProposalState } from '../../../oasis-nexus/api'

const StyledBox = styled(Box)(({ theme }) => ({
  textTransform: 'capitalize',
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

const statuses = {
  [ProposalState.active]: {
    textColor: COLORS.grayExtraDark,
    backgroundColor: COLORS.honeydew,
    iconColor: COLORS.eucalyptus,
    icon: CheckCircleIcon,
  },
  [ProposalState.passed]: {
    textColor: COLORS.white,
    backgroundColor: COLORS.eucalyptus,
    iconColor: COLORS.honeydew,
    icon: CheckCircleIcon,
  },
  [ProposalState.rejected]: {
    textColor: COLORS.white,
    backgroundColor: COLORS.errorIndicatorBackground,
    iconColor: COLORS.linen,
    icon: CancelIcon,
  },
  [ProposalState.failed]: {
    textColor: COLORS.grayExtraDark,
    backgroundColor: COLORS.linen,
    iconColor: COLORS.errorIndicatorBackground,
    icon: CancelIcon,
  },
}

type ProposalStatusIconProps = {
  status: ProposalState
}

export const ProposalStatusIcon: FC<ProposalStatusIconProps> = ({ status }) => {
  if (!ProposalState[status]) {
    return null
  }

  const statusConfig = statuses[status]
  const IconComponent = statusConfig.icon

  return (
    <StyledBox sx={{ backgroundColor: statusConfig.backgroundColor, color: statusConfig.textColor }}>
      {status}
      <StyledIcon sx={{ color: statusConfig.iconColor }}>
        <IconComponent color="inherit" fontSize="inherit" />
      </StyledIcon>
    </StyledBox>
  )
}
