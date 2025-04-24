import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData, useOutletContext } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { RouterTabs } from '../../components/RouterTabs'
import { useAllTokenPrices } from '../../../coin-gecko/api'
import { EvmTokenType, RuntimeAccount } from '../../../oasis-nexus/api'
import { useAccount } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTokenInfo } from '../TokenDashboardPage/hook'
import { getTokenTypePluralName } from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeAccountDetailsCard } from './RuntimeAccountDetailsCard'
import { DappBanner } from '../../components/DappBanner'
import { AddressLoaderData } from '../../utils/route-utils'
import { getFiatCurrencyForScope } from '../../../config'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import {
  codeContainerId,
  eventsContainerId,
  tokenContainerId,
  transfersContainerId,
} from '../../utils/tabAnchors'

export type RuntimeAccountDetailsContext = {
  scope: SearchScope
  address: string
  account?: RuntimeAccount
  method: string
  setMethod: (value: string) => void
}

export const useRuntimeAccountDetailsProps = () => useOutletContext<RuntimeAccountDetailsContext>()

export const RuntimeAccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const { address, searchTerm } = useLoaderData() as AddressLoaderData
  const { method, setMethod } = useRuntimeTxMethodParam()
  const { account, isLoading: isAccountLoading, isError } = useAccount(scope, address)
  const isContract = !!account?.evm_contract
  const { token, isLoading: isTokenLoading } = useTokenInfo(scope, address, { enabled: isContract })

  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))

  const eventsLink = useHref(`events#${eventsContainerId}`)
  const tokenTransfersLink = useHref(`token-transfers#${transfersContainerId}`)
  const erc20Link = useHref(`tokens/erc-20#${tokenContainerId}`)
  const erc721Link = useHref(`tokens/erc-721#${tokenContainerId}`)

  const txLink = useHref('')
  const showCode = isContract
  const codeLink = useHref(`code#${codeContainerId}`)

  const isLoading = isAccountLoading || isTokenLoading

  const context: RuntimeAccountDetailsContext = { scope, address, account, method, setMethod }

  return (
    <PageLayout>
      <RuntimeAccountDetailsCard
        isLoading={isLoading}
        isError={isError}
        isContract={isContract}
        account={account}
        token={token}
        tokenPrices={tokenPrices}
        highlightedPartOfName={searchTerm}
      />
      <DappBanner scope={scope} ethOrOasisAddress={address} />
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          { label: t('common.events'), to: eventsLink },
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
    </PageLayout>
  )
}
