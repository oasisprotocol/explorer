import { FC } from 'react'
import { DashboardDivider } from '../../components/Divider'
import { isLocalnet } from '../../utils/route-utils'
import { PageLayout } from '../../components/PageLayout'
import { TotalTransactions } from '../../components/TotalTransactions'
import { TransactionsStats } from '../../components/TransactionsStats'
import { Social } from '../../components/Social'
import { useConsensusScope } from '../../hooks/useScopeParam'
import { LearningMaterials } from './LearningMaterials'
import { NetworkProposalsCard } from './NetworkProposalsCard'
import { ValidatorsCard } from './Validators'
import { ConsensusSnapshot } from './ConsensusSnapshot'
import { LatestConsensusBlocks } from './LatestConsensusBlocks'
import { AccountsCard } from './AccountsCard'
import { LatestConsensusTransactions } from './LatestConsensusTransactions'
import { ParaTimesCard } from './ParaTimesCard'
import { ConsensusScope } from 'types/searchScope'
import { useConsensusTxMethodParam } from '../../hooks/useCommonParams'

export const ConsensusDashboardPage: FC = () => {
  const scope = useConsensusScope()
  const isLocal = isLocalnet(scope.network)
  const { txMethod, setTxMethod } = useConsensusTxMethodParam()

  return (
    <PageLayout>
      {!isLocal && <ConsensusSnapshot scope={scope} />}
      <DashboardDivider />
      {!isLocal && (
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-6 flex">
            <TotalTransactions chartContainerHeight={350} scope={scope} />
          </div>
          <LatestBlocksGrid scope={scope} />
        </div>
      )}
      {isLocal && <LatestBlocksGrid scope={scope} />}
      <ValidatorsCard scope={scope} />
      {!isLocal && <ParaTimesCard scope={scope} />}
      <AccountsCard scope={scope} />
      <LatestConsensusTransactions scope={scope} txMethod={txMethod} setTxMethod={setTxMethod} />
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

const LatestBlocksGrid = ({ scope }: { scope: ConsensusScope }) => {
  return (
    <div className="col-span-12 lg:col-span-6 flex">
      <LatestConsensusBlocks scope={scope} />
    </div>
  )
}
