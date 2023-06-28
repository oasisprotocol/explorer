import { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import { DurationSelect } from '../../components/Snapshots/DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { RosePriceCard } from './RosePriceCard'
import { Nodes } from './Nodes'
import { ActiveAccounts } from './ActiveAccounts'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Network } from '../../../types/network'
import { getLayerNames } from '../../../types/layers'
import { TestnetFaucet } from './TestnetFaucet'

const StyledGrid = styled(Grid)(() => ({
  display: 'flex',
}))

export const ParaTimeSnapshot: FC = () => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)
  const scope = useRequiredScopeParam()
  const paratime = getLayerNames(t)[scope.layer]
  const theme = useTheme()
  const { isMobile } = useScreenSize()
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
          <AppendMobileSearch scope={scope}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 2 }}>
              <Typography
                variant="h3"
                sx={{ color: theme.palette.layout.main, fontWeight: 700, mr: 3, mb: isMobile ? 4 : 0 }}
              >
                {t('paraTimeSnapshot.header', { paratime })}
              </Typography>
              <DurationSelect
                defaultValue={defaultChartDurationValue}
                handleChange={handleDurationSelectedChange}
              />
            </Box>
          </AppendMobileSearch>
        </Grid>
      </Grid>

      <Grid container rowSpacing={1} columnSpacing={4} columns={22}>
        <StyledGrid item xs={22} md={6}>
          <TransactionsChartCard chartDuration={chartDuration} />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <ActiveAccounts chartDuration={chartDuration} />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <Nodes />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          {scope.network === Network.mainnet && <RosePriceCard />}
          {scope.network === Network.testnet && <TestnetFaucet />}
        </StyledGrid>
      </Grid>
    </>
  )
}
