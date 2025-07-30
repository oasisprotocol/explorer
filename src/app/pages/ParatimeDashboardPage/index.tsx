import { FC } from 'react'
import { DashboardDivider } from '../../components/Divider'
import Grid from '@mui/material/Grid'
import { useScreenSize } from '../../hooks/useScreensize'
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
import { LatestRoflApps } from './LatestRoflApps'
import { paraTimesConfig } from '../../../config'

export const ParatimeDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRuntimeScope()
  const isLocal = isLocalnet(scope.network)
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()

  return (
    <PageLayout>
      {!isLocal && <ParaTimeSnapshot scope={scope} />}
      <DashboardDivider />
      <LatestRuntimeTransactions scope={scope} txMethod={txMethod} setTxMethod={setTxMethod} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', order: isMobile ? 1 : 0 }}>
          <LearningMaterials scope={scope} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestRuntimeBlocks scope={scope} />
        </Grid>
        <Grid item xs={12}>
          <TopTokens scope={scope} />
          {paraTimesConfig[scope.layer]?.offerRoflTxTypes && <LatestRoflApps scope={scope} />}
        </Grid>
      </Grid>
      {!isLocal && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TransactionsStats scope={scope} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TotalTransactions scope={scope} />
            </Grid>
          </Grid>
          <Social />
        </>
      )}
    </PageLayout>
  )
}
