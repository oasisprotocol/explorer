import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { ChartDuration } from '../../utils/chart-utils'
import { COLORS } from '../../../styles/theme/colors'

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.brandDark,
  width: 14,
  height: 14,
  marginRight: theme.spacing(3),
  borderRadius: 4,
}))

export const DurationPills: FC = () => {
  const { t } = useTranslation()
  const options = [
    {
      label: t('chartDuration.week'),
      value: ChartDuration.WEEK,
    },
    {
      label: t('chartDuration.month'),
      value: ChartDuration.MONTH,
    },
    {
      label: t('chartDuration.allTime'),
      value: ChartDuration.ALL_TIME,
    },
  ]

  return (
    <>
      {options.map(option => (
        <Chip
          key={option.value}
          onClick={() => console.log('click')}
          clickable
          color="secondary"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StyledBox />
              <Typography component="span" sx={{ fontSize: 12 }}>
                {option.label}
              </Typography>
            </Box>
          }
          sx={{ mr: 2 }}
          variant="outlined"
        />
      ))}
    </>
  )
}
