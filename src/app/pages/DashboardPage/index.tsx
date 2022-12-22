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
import { ParatimeSnaphosts } from './ParatimeSnaphosts'

export const DashboardPage: FC = () => {
  return (
    <PageLayout>
      <ParatimeSnaphosts />

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
