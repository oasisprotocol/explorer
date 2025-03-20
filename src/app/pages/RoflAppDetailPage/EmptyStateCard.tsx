import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import DataObjectIcon from '@mui/icons-material/DataObject'
import { COLORS } from '../../../styles/theme/colors'
import { t } from 'i18next'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: '150px',
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: '200px',
  },
}))

export const EmptyStateCard: FC = () => {
  return (
    <StyledBox gap={3}>
      <DataObjectIcon sx={{ color: COLORS.grayMedium, fontSize: 40, opacity: 0.5 }} />
      <Typography
        sx={{
          color: COLORS.grayMedium,
          fontWeight: 700,
          textAlign: 'center',
          opacity: 0.5,
        }}
      >
        {t('rofl.noData')}
      </Typography>
    </StyledBox>
  )
}
