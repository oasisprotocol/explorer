import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { useGetConsensusAccountsAddress } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { AddressLoaderData } from '../../utils/route-utils'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { ConsensusAccountDetailsCard } from './ConsensusAccountDetailsCard'
import { RouterTabs } from '../../components/RouterTabs'
import { BalanceDistribution } from './BalanceDistribution'
import { Staking } from './Staking'
import { ConsensusAccountDetailsContext } from './hooks'
import { useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { eventsContainerId } from '../../utils/tabAnchors'
import { getHighlightPattern, textSearch } from "../../components/Search/search-utils";

export const ConsensusAccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const { network } = scope
  const { address, searchQuery } = useLoaderData() as AddressLoaderData
  const highlightPattern = getHighlightPattern(textSearch.accountName(searchQuery))
  const { method, setMethod } = useConsensusTxMethodParam()
  const accountQuery = useGetConsensusAccountsAddress(network, address)
  const { isError, isLoading, data } = accountQuery
  const account = data?.data
  const transactionsLink = useHref('')
  const eventsLink = useHref(`events#${eventsContainerId}`)
  const context: ConsensusAccountDetailsContext = { scope, address, method, setMethod }

  return (
    <PageLayout>
      <ConsensusAccountDetailsCard
        account={account}
        isError={isError}
        isLoading={isLoading}
        highlightPattern={highlightPattern}
      />
      <Grid container spacing={4} sx={{ mb: isMobile ? 4 : 5 }}>
        <Grid item xs={12} md={6}>
          <BalanceDistribution account={account} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={6}>
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
