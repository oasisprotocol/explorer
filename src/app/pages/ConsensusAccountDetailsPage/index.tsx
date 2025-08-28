import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { useGetConsensusAccountsAddress } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { AddressLoaderData } from '../../utils/route-utils'
import { useConsensusScope } from '../../hooks/useScopeParam'
import { ConsensusAccountDetailsCard } from './ConsensusAccountDetailsCard'
import { RouterTabs } from '../../components/RouterTabs'
import { BalanceDistribution } from './BalanceDistribution'
import { Staking } from './Staking'
import { ConsensusAccountDetailsContext } from './hooks'
import { useConsensusEventTypeParam, useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { eventsContainerId } from '../../utils/tabAnchors'

export const ConsensusAccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useConsensusScope()
  const { network } = scope
  const { address } = useLoaderData() as AddressLoaderData
  const { txMethod, setTxMethod } = useConsensusTxMethodParam()
  const { eventType, setEventType } = useConsensusEventTypeParam()
  const accountQuery = useGetConsensusAccountsAddress(network, address)
  const { isError, isLoading, data } = accountQuery
  const account = data?.data
  const transactionsLink = useHref('')
  const eventsLink = useHref(`events#${eventsContainerId}`)
  const context: ConsensusAccountDetailsContext = {
    scope,
    address,
    txMethod,
    setTxMethod,
    eventType,
    setEventType,
  }

  return (
    <PageLayout>
      <ConsensusAccountDetailsCard account={account} isError={isError} isLoading={isLoading} />
      <Grid container spacing={4} sx={{ mb: isMobile ? 4 : 5 }}>
        <Grid item xs={12} lg={6}>
          <BalanceDistribution account={account} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Staking account={account} isLoading={isLoading} />
        </Grid>
      </Grid>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: transactionsLink },
          { label: t('common.events'), to: eventsLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}
