import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { ProposalVoteValue } from '../../../types/vote'
import { AppErrors } from '../../../types/errors'

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
  [ProposalVoteValue.abstain]: {
    backgroundColor: COLORS.lightSilver,
    icon: RemoveCircleIcon,
    iconColor: COLORS.grayMedium,
    label: t('networkProposal.vote.abstain'),
    textColor: COLORS.grayExtraDark,
  },
  [ProposalVoteValue.yes]: {
    backgroundColor: COLORS.honeydew,
    icon: CheckCircleIcon,
    iconColor: COLORS.eucalyptus,
    label: t('networkProposal.vote.yes'),
    textColor: COLORS.grayExtraDark,
  },
  [ProposalVoteValue.no]: {
    backgroundColor: COLORS.linen,
    icon: CancelIcon,
    iconColor: COLORS.errorIndicatorBackground,
    label: t('networkProposal.vote.no'),
    textColor: COLORS.grayExtraDark,
  },
})

type ProposalVoteIndicatorProps = {
  vote: ProposalVoteValue
}

export const ProposalVoteIndicator: FC<ProposalVoteIndicatorProps> = ({ vote }) => {
  const { t } = useTranslation()

  if (!ProposalVoteValue[vote]) {
    throw AppErrors.InvalidVote
  }

  const statusConfig = getStatuses(t)[vote]
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
