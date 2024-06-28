import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { useGetConsensusAccountsAddress, useGetConsensusValidatorsAddress } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { AddressLoaderData } from '../../utils/route-utils'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { ConsensusAccountDetailsCard } from './ConsensusAccountDetailsCard'
import { RouterTabs } from '../../components/RouterTabs'
import { BalanceDistribution } from './BalanceDistribution'
import { Staking } from './Staking'
import { ConsensusAccountDetailsContext } from './hooks'

export const ConsensusAccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const { network } = scope
  const { address, searchTerm } = useLoaderData() as AddressLoaderData
  const accountQuery = useGetConsensusAccountsAddress(network, address)
  const { isError, isLoading, data } = accountQuery
  const account = data?.data
  const { data: validatorData } = useGetConsensusValidatorsAddress(network, address)
  const validator = validatorData?.data
  const transactionsLink = useHref('')
  const context: ConsensusAccountDetailsContext = { scope, address }

  return (
    <PageLayout>
      <ConsensusAccountDetailsCard
        account={account}
        validator={validator}
        isError={isError}
        isLoading={isLoading}
        highlightedPartOfName={searchTerm}
      />
      <Grid container spacing={4} sx={{ mb: isMobile ? 4 : 5 }}>
        <Grid item xs={12} md={6}>
          <BalanceDistribution account={account} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Staking account={account} isLoading={isLoading} />
        </Grid>
      </Grid>
      <RouterTabs tabs={[{ label: t('common.transactions'), to: transactionsLink }]} context={context} />
    </PageLayout>
  )
}
