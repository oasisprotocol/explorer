import { FC } from 'react'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

type ProposalStatus = {
  success: boolean
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'success',
})<ProposalStatus>(({ success }) => ({
  justifyContent: 'end',
  color: success ? COLORS.eucalyptus : COLORS.errorIndicatorBackground,
  textTransform: 'capitalize',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
  flex: 1,
}))

const StyledIcon = styled(Box, {
  shouldForwardProp: prop => prop !== 'success',
})<ProposalStatus>(({ success }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '28px',
  height: '28px',
  fontSize: '15px',
  backgroundColor: success ? COLORS.honeydew : COLORS.linen,
  borderRadius: 10,
  padding: 4,
  paddingLeft: 12,
  paddingRight: 12,
}))

type ProposalStatusIconProps = {
  status: string
}

const knownStatuses = ['active', 'passed', 'failed', 'rejected']

export const ProposalStatusIcon: FC<ProposalStatusIconProps> = ({ status }) => {
  if (!knownStatuses.includes(status)) {
    return null
  }
  // TODO: we don't have designs for all types of statuses
  const success = status === 'active' || status === 'passed'
  return (
    <StyledBox success={success}>
      <StyledIcon success={success}>
        {success ? (
          <CheckCircleIcon color="success" fontSize="inherit" />
        ) : (
          <CancelIcon color="error" fontSize="inherit" />
        )}
      </StyledIcon>
      {status}
    </StyledBox>
  )
}
