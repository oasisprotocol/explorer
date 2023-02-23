import { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { DurationSelect } from './DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { RoseChartCard } from './RoseChartCard'
import { Nodes } from './Nodes'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'

const StyledGrid = styled(Grid)(() => ({
  display: 'flex',
}))

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
          <AppendMobileSearch>
            <Typography variant="h3" sx={{ color: COLORS.white, fontWeight: 700 }}>
              {t('paraTimeSnapshot.header')}
            </Typography>
          </AppendMobileSearch>
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

      <Grid container rowSpacing={1} columnSpacing={4} sx={{ marginBottom: 4 }}>
        <StyledGrid item xs={12} md={3}>
          <TransactionsChartCard chartDuration={chartDuration} />
        </StyledGrid>
        <StyledGrid item xs={12} md={3}></StyledGrid>
        <StyledGrid item xs={12} md={3}>
          <Nodes />
        </StyledGrid>
        <StyledGrid item xs={12} md={3}>
          <RoseChartCard chartDuration={chartDuration} />
        </StyledGrid>
      </Grid>
    </>
  )
}
