import { FC } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { COLORS } from '../../../styles/theme/colors'

const iconSize = '28px'
export const StyledCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: iconSize,
  height: iconSize,
  color: COLORS.eucalyptus,
  backgroundColor: COLORS.lightGreen,
  borderRadius: iconSize,
  marginLeft: theme.spacing(3),
  marginRight: `-${theme.spacing(4)}`,
}))

export const TransferIcon: FC = () => {
  return (
    <StyledCircle>
      <ArrowForwardIcon fontSize="inherit" />
    </StyledCircle>
  )
}
