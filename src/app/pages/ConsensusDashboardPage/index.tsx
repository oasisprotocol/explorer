import { FC } from 'react'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { isLocalnet } from '../../utils/route-utils'
import { PageLayout } from '../../components/PageLayout'
import { useScreenSize } from '../../hooks/useScreensize'
import { TotalTransactions } from '../../components/TotalTransactions'
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
import { ParaTimesCard } from './ParaTimesCard'
import { SearchScope } from 'types/searchScope'

export const ConsensusDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const isLocal = isLocalnet(scope.network)

  return (
    <PageLayout>
      {!isLocal && <ConsensusSnapshot scope={scope} />}
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      {!isLocal && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <TotalTransactions chartContainerHeight={350} scope={scope} />
          </Grid>
          <LatestBlocksGrid scope={scope} />
        </Grid>
      )}
      {isLocal && <LatestBlocksGrid scope={scope} />}
      <ValidatorsCard scope={scope} />
      {!isLocal && <ParaTimesCard scope={scope} />}
      <AccountsCard scope={scope} />
      <LatestConsensusTransactions scope={scope} />
      {!isLocal && (
        <>
          <NetworkProposalsCard scope={scope} />
          <TransactionsStats scope={scope} />
        </>
      )}
      <LearningMaterials />
      {!isLocal && <Social />}
    </PageLayout>
  )
}

const LatestBlocksGrid = ({ scope }: { scope: SearchScope }) => {
  return (
    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
      <LatestConsensusBlocks scope={scope} />
    </Grid>
  )
}
