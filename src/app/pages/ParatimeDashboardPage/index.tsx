import { FC } from 'react'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useScreenSize } from '../../hooks/useScreensize'
import { Social } from './Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestBlocks } from './LatestBlocks'
import { LatestTransactions } from './LatestTransactions'
import { TransactionsStats } from './TransactionsStats'
import { TotalTransactions } from './TotalTransactions'
import { PageLayout } from '../../components/PageLayout'
import { ParaTimeSnapshot } from './ParaTimeSnapshot'
import { TopTokens } from './TopTokens'

export const ParatimeDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()

  return (
    <PageLayout>
      <ParaTimeSnapshot />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <LatestTransactions />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', order: isMobile ? 1 : 0 }}>
          <LearningMaterials />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestBlocks />
        </Grid>
      </Grid>
      <TopTokens />
      <TransactionsStats />
      <TotalTransactions />
      <Social />
    </PageLayout>
  )
}
