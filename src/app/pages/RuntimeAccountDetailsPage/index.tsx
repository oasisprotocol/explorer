import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router'
import { PageLayout } from '../../components/PageLayout'
import { RouterTabs } from '../../components/RouterTabs'
import { useAllTokenPrices } from '../../../coin-gecko/api'
import { EvmTokenType } from '../../../oasis-nexus/api'
import { useAccount } from './hooks'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useTokenInfo } from '../TokenDashboardPage/hooks'
import { getTokenTypePluralName } from '../../../types/tokens'
import { RuntimeAccountDetailsCard } from './RuntimeAccountDetailsCard'
import { DappBanner } from '../../components/DappBanner'
import { AddressLoaderData } from '../../utils/route-utils'
import { getFiatCurrencyForScope } from '../../../config'
import { useRuntimeEventTypeParam, useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import {
  codeContainerId,
  eventsContainerId,
  tokenContainerId,
  transfersContainerId,
} from '../../utils/tabAnchors'
import { Staking } from './Staking'
import { RuntimeAccountDetailsContext } from './types'

export const RuntimeAccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRuntimeScope()
  const { address } = useLoaderData() as AddressLoaderData
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()
  const { eventType, setEventType } = useRuntimeEventTypeParam()
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

  const context: RuntimeAccountDetailsContext = {
    scope,
    address,
    account,
    txMethod,
    setTxMethod,
    eventType,
    setEventType,
  }

  return (
    <PageLayout>
      <RuntimeAccountDetailsCard
        isLoading={isLoading}
        isError={isError}
        isContract={isContract}
        account={account}
        token={token}
        tokenPrices={tokenPrices}
      />
      <DappBanner scope={scope} ethOrOasisAddress={address} />
      <Staking account={account} isLoading={isLoading} />
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
