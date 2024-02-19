import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: '150px',
    paddingTop: theme.spacing(3),
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: '200px',
    paddingTop: theme.spacing(6),
  },
}))

type ConsensusAccountCardEmptyStateProps = {
  children?: ReactNode
  label: string
}

export const ConsensusAccountCardEmptyState: FC<ConsensusAccountCardEmptyStateProps> = ({
  children,
  label,
}) => {
  return (
    <StyledBox gap={3}>
      <StackedBarChartIcon sx={{ color: COLORS.grayMedium, fontSize: 40, opacity: 0.5 }} />
      <Typography
        sx={{
          color: COLORS.grayMedium,
          fontWeight: 700,
          maxWidth: '170px',
          textAlign: 'center',
          opacity: 0.5,
        }}
      >
        {label}
      </Typography>
      {children}
    </StyledBox>
  )
}
