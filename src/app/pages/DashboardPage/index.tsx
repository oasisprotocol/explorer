import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { Social } from './Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestBlocks } from './LatestBlocks'
import { LatestTransactions } from './LatestTransactions'
import { TransactionsPerSecond } from './TransactionsPerSecond'
import { AverageTransactionSize } from './AverageTransactionSize'

export function DashboardPage() {
  return (
    <>
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
      <TransactionsPerSecond />
      <AverageTransactionSize />
      <Social />
    </>
  )
}
