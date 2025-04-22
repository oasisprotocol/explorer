import { FC } from 'react'
import Divider from '@mui/material/Divider'
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
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { LatestRoflApps } from './LatestRoflApps'

export const ParatimeDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const isLocal = isLocalnet(scope.network)
  const { method, setMethod } = useRuntimeTxMethodParam()

  return (
    <PageLayout>
      {!isLocal && <ParaTimeSnapshot scope={scope} />}
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <LatestRuntimeTransactions scope={scope} method={method} setMethod={setMethod} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', order: isMobile ? 1 : 0 }}>
          <LearningMaterials scope={scope} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestRuntimeBlocks scope={scope} />
        </Grid>
        <Grid item xs={12}>
          <TopTokens scope={scope} />
          {scope.layer === 'sapphire' && <LatestRoflApps scope={scope} />}
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
