import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  gap: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 2, 6),
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6, 4, 7),
  },
}))

type CardEmptyStateProps = {
  label: string
}

export const CardEmptyState: FC<CardEmptyStateProps> = ({ label }) => (
  <StyledBox>
    <ReportProblemIcon sx={{ color: COLORS.warningColor, fontSize: '60px' }} />
    <Typography sx={{ color: COLORS.grayDark }}>{label}</Typography>
  </StyledBox>
)
