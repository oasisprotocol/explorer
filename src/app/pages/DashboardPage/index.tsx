import { Social } from './Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestBlocks } from './LatestBlocks'
import { LatestTransactions } from './LatestTransactions'
import { TransactionsPerSecond } from './TransactionsPerSecond'
import { AverageTransactionSize } from './AverageTransactionSize'
import { PageLayout } from '../../components/PageLayout'
import { AppDivider } from '../../components/AppDivider/AppDivider'
import { AppGrid } from '../../components/AppGrid/AppGrid'

export function DashboardPage() {
  return (
    <PageLayout>
      <AppDivider variant="layout" />
      <LatestTransactions />
      <AppGrid container spacing={4}>
        <AppGrid item xs={12} md={6}>
          <LearningMaterials />
        </AppGrid>
        <AppGrid item xs={12} md={6}>
          <LatestBlocks />
        </AppGrid>
      </AppGrid>
      <TransactionsPerSecond />
      <AverageTransactionSize />
      <Social />
    </PageLayout>
  )
}
