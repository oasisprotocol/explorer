import { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { DurationSelect } from './DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { RoseChartCard } from './RoseChartCard'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'
import { ExpandableSearch } from '../../components/ExpandableSearch'

export const ParaTimeSnapshot: FC = () => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const handleDurationSelectedChange = (duration: ChartDuration | null) => {
    if (!duration) {
      return
    }

    setChartDuration(duration)
  }

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item xs={12} sx={{ px: isMobile ? 4 : 0 }}>
          <ExpandableSearch>
            <Typography variant="h3" sx={{ color: COLORS.white }}>
              {t('paraTimeSnapshot.header')}
            </Typography>
          </ExpandableSearch>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ pl: isMobile ? 4 : 0, pb: isMobile ? 3 : 0 }}>
            <DurationSelect
              defaultValue={defaultChartDurationValue}
              handleChange={handleDurationSelectedChange}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <TransactionsChartCard chartDuration={chartDuration} />
        </Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}>
          <RoseChartCard chartDuration={chartDuration} />
        </Grid>
      </Grid>
    </>
  )
}
