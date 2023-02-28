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
import { ParaTimeSnapshot } from './ParaTimeSnapshot'
import { useParaTimeLocation } from '../../hooks/useParaTimeLocation'

export const DashboardPage: FC = () => {
  const { isEmerald, isSapphire, isCipher } = useParaTimeLocation()
  console.log('isEmerald', isEmerald)
  console.log('isSapphire', isSapphire)
  console.log('isCipher', isCipher)

  return (
    <PageLayout>
      <ParaTimeSnapshot />
      <Divider variant="layout" />
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
      <AverageTransactionSize />
      <Social />
    </PageLayout>
  )
}
