import { FC, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { DurationSelect } from './DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'

export const ParaTimeSnapshot: FC = () => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)

  const handleDurationSelectedChange = (duration: ChartDuration | null) => {
    if (!duration) {
      return
    }

    setChartDuration(duration)
  }

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item>
          <Typography variant="h3" sx={{ color: COLORS.white }}>
            {t('paraTimeSnapshot.header')}
          </Typography>
        </Grid>
        <Grid item>
          <DurationSelect
            defaultValue={defaultChartDurationValue}
            handleChange={handleDurationSelectedChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
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
