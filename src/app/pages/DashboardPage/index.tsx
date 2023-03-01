import { FC } from 'react'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Social } from './Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestBlocks } from './LatestBlocks'
import { LatestTransactions } from './LatestTransactions'
import { TransactionsStats } from './TransactionsStats'
import { TotalTransactions } from './TotalTransactions'
import { PageLayout } from '../../components/PageLayout'
import { ParaTimeSnapshot } from './ParaTimeSnapshot'

export const DashboardPage: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <PageLayout>
      <ParaTimeSnapshot />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <LatestTransactions />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <LearningMaterials />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestBlocks />
        </Grid>
      </Grid>
      <TransactionsStats />
      <TotalTransactions />
      <Social />
    </PageLayout>
  )
}
