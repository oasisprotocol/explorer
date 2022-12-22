import { FC, useCallback, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { DurationSelect } from './DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'

export const ParatimeSnaphosts: FC = () => {
  const { t } = useTranslation()
  const [chartDuration, setChartDuration] = useState<ChartDuration>(ChartDuration.TODAY)

  const handleDurationSelectedChange = useCallback((duration: ChartDuration | null) => {
    if (!duration) {
      return
    }

    setChartDuration(duration)
  }, [])

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item>
          <Typography variant="h3" sx={{ color: COLORS.white }}>
            {t('.paratimeSnaphosts.header')}
          </Typography>
        </Grid>
        <Grid item>
          <DurationSelect defaultValue={chartDuration} handleChange={handleDurationSelectedChange} />
        </Grid>
      </Grid>

      <Grid container spacing="10px">
        <Grid item xs={12} md={3}>
          <TransactionsChartCard chartDuration={chartDuration} />
        </Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}></Grid>
      </Grid>
    </>
  )
}
