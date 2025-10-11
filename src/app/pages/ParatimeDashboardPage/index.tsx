import { FC } from 'react'
import { DashboardDivider } from '../../components/Divider'
import { isLocalnet } from '../../utils/route-utils'
import { Social } from '../../components/Social'
import { LearningMaterials } from './LearningMaterials'
import { LatestRuntimeBlocks } from './LatestRuntimeBlocks'
import { LatestRuntimeTransactions } from './LatestRuntimeTransactions'
import { TransactionsStats } from '../../components/TransactionsStats'
import { TotalTransactions } from '../../components/TotalTransactions'
import { PageLayout } from '../../components/PageLayout'
import { ParaTimeSnapshot } from './ParaTimeSnapshot'
import { TopTokens } from './TopTokens'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { paraTimesConfig } from '../../../config'
import { LatestRoflApps } from './LatestRoflApps'

export const ParatimeDashboardPage: FC = () => {
  const scope = useRuntimeScope()
  const isLocal = isLocalnet(scope.network)
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()

  const { hideTokensFromDashboard } = paraTimesConfig[scope.layer]!

  return (
    <PageLayout>
      {!isLocal && <ParaTimeSnapshot scope={scope} />}
      <DashboardDivider />
      <LatestRuntimeTransactions scope={scope} txMethod={txMethod} setTxMethod={setTxMethod} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
        <div className="flex order-1 md:order-0">
          <LearningMaterials scope={scope} />
        </div>
        <div className="flex">
          <LatestRuntimeBlocks scope={scope} />
        </div>
        <div className="col-span-1 lg:col-span-2">
          {!hideTokensFromDashboard && <TopTokens scope={scope} />}
          {paraTimesConfig[scope.layer]?.offerRoflTxTypes && <LatestRoflApps scope={scope} />}
        </div>
      </div>
      {!isLocal && (
        <>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-6">
              <TransactionsStats scope={scope} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <TotalTransactions scope={scope} />
            </div>
          </div>
          <Social />
        </>
      )}
    </PageLayout>
  )
}
