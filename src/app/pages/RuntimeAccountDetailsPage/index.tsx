import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData, useOutletContext } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { RouterTabs } from '../../components/RouterTabs'
import { useAllTokenPrices } from '../../../coin-gecko/api'

import { EvmTokenType, RuntimeAccount } from '../../../oasis-nexus/api'
import { accountTokenContainerId } from './AccountTokensCard'
import { useAccount, useAccountEvents } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { contractCodeContainerId } from './ContractCodeCard'
import { useTokenInfo } from '../TokenDashboardPage/hook'
import { accountTokenTransfersContainerId } from './AccountTokenTransfersCard'
import { getTokenTypePluralName } from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'
import { AccountDetailsCard } from './AccountDetailsCard'
import { AccountEventsCard } from './AccountEventsCard'
import { DappBanner } from '../../components/DappBanner'
import { AddressLoaderData } from '../../utils/route-utils'
import { getFiatCurrencyForScope } from '../../../config'

export type RuntimeAccountDetailsContext = {
  scope: SearchScope
  address: string
  account?: RuntimeAccount
}

export const useRuntimeAccountDetailsProps = () => useOutletContext<RuntimeAccountDetailsContext>()

export const RuntimeAccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const { address, searchTerm } = useLoaderData() as AddressLoaderData
  const { account, isLoading: isAccountLoading, isError } = useAccount(scope, address)
  const isContract = !!account?.evm_contract
  const { token, isLoading: isTokenLoading } = useTokenInfo(scope, address, isContract)

  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))

  const { isLoading: areEventsLoading, isError: isEventsError, events } = useAccountEvents(scope, address)

  const tokenTransfersLink = useHref(`token-transfers#${accountTokenTransfersContainerId}`)
  const erc20Link = useHref(`tokens/erc-20#${accountTokenContainerId}`)
  const erc721Link = useHref(`tokens/erc-721#${accountTokenContainerId}`)

  const txLink = useHref('')
  const showCode = isContract
  const codeLink = useHref(`code#${contractCodeContainerId}`)

  const isLoading = isAccountLoading || isTokenLoading

  const context: RuntimeAccountDetailsContext = { scope, address, account }

  return (
    <PageLayout>
      <AccountDetailsCard
        isLoading={isLoading}
        isError={isError}
        isContract={isContract}
        account={account}
        token={token}
        tokenPrices={tokenPrices}
        highlightedPartOfName={searchTerm}
      />
      <DappBanner scope={scope} ethAddress={account?.address_eth} />
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          { label: t('common.transfers'), to: tokenTransfersLink },
          {
            label: getTokenTypePluralName(t, EvmTokenType.ERC20),
            to: erc20Link,
          },
          {
            label: getTokenTypePluralName(t, EvmTokenType.ERC721),
            to: erc721Link,
          },
          { label: t('contract.code'), to: codeLink, visible: showCode },
        ]}
        context={context}
      />
      <AccountEventsCard scope={scope} isLoading={areEventsLoading} isError={isEventsError} events={events} />
    </PageLayout>
  )
}
