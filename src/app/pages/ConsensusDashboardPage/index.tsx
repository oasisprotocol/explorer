import { FC } from 'react'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useScreenSize } from '../../hooks/useScreensize'
import { TotalTransactions } from '../ParatimeDashboardPage/TotalTransactions'
import { TransactionsStats } from '../../components/TransactionsStats'
import { Social } from '../../components/Social'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { LearningMaterials } from './LearningMaterials'
import { NetworkProposalsCard } from './NetworkProposalsCard'
import { ValidatorsCard } from './Validators'
import { ConsensusSnapshot } from './ConsensusSnapshot'
import { LatestConsensusBlocks } from './LatestConsensusBlocks'
import { AccountsCard } from './AccountsCard'
import { LatestConsensusTransactions } from './LatestConsensusTransactions'

export const ConsensusDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()

  return (
    <PageLayout>
      <ConsensusSnapshot scope={scope} />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TotalTransactions scope={scope} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestConsensusBlocks scope={scope} />
        </Grid>
      </Grid>
      <ValidatorsCard scope={scope} />
      <AccountsCard scope={scope} />
      <LatestConsensusTransactions scope={scope} />
      <NetworkProposalsCard scope={scope} />
      <TransactionsStats scope={scope} />
      <LearningMaterials />
      <Social />
    </PageLayout>
  )
}
