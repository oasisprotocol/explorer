import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { useGetConsensusAccountsAddress } from '../../../oasis-nexus/api'
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
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-6">
          <BalanceDistribution account={account} isLoading={isLoading} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Staking account={account} isLoading={isLoading} />
        </div>
      </div>
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
