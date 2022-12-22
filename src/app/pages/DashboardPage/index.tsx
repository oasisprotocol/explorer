import { FC } from 'react'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { Social } from './Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestBlocks } from './LatestBlocks'
import { LatestTransactions } from './LatestTransactions'
import { TransactionsStats } from './TransactionsStats'
import { AverageTransactionSize } from './AverageTransactionSize'
import { PageLayout } from '../../components/PageLayout'
import { TransactionsChartCard } from './TransactionsChartCard'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { DurationSelect } from '../../components/DurationSelect'
import { Button } from '@mui/material'

export const DashboardPage: FC = () => {
  return (
    <PageLayout>
      <Grid container spacing="2">
        <Grid item>
          <Typography variant="h3" sx={{ color: COLORS.white }}>
            Paratime Snapshot
          </Typography>
        </Grid>
        <Grid item>
          <DurationSelect />
        </Grid>
        <Grid item>
          <Button color="secondary">Button</Button>
        </Grid>
      </Grid>

      <Grid container spacing="10px">
        <Grid item xs={12} md={3}>
          <TransactionsChartCard />
        </Grid>
        <Grid item xs={12} md={3}>
          Active accounts
        </Grid>
        <Grid item xs={12} md={3}>
          Compute nodes
        </Grid>
        <Grid item xs={12} md={3}>
          ROSE Price
        </Grid>
      </Grid>

    <Divider variant="layout" />
    <LatestTransactions />
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <LearningMaterials />
      </Grid>
      <Grid item xs={12} md={6}>
        <LatestBlocks />
      </Grid>
    </Grid>
    <TransactionsStats />
    <AverageTransactionSize />
    <Social />
  </PageLayout>
)
