import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData, useOutletContext } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { TokenPriceInfo, useTokenPrice } from '../../../coin-gecko/api'
import { Ticker } from '../../../types/ticker'

import { EvmToken, EvmTokenType, RuntimeAccount } from '../../../oasis-nexus/api'
import { accountTokenContainerId } from './AccountTokensCard'
import { useAccount } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { CardEmptyState } from './CardEmptyState'
import { contractCodeContainerId } from './ContractCodeCard'
import { useTokenInfo } from '../TokenDashboardPage/hook'
import { accountTokenTransfersContainerId } from './AccountTokenTransfersCard'
import { getTokenTypePluralName } from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'

export type AccountDetailsContext = {
  scope: SearchScope
  address: string
}

export const useAccountDetailsProps = () => useOutletContext<AccountDetailsContext>()

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { account, isLoading: isAccountLoading, isError } = useAccount(scope, address)
  const isContract = !!account?.evm_contract
  const { token, isLoading: isTokenLoading } = useTokenInfo(scope, address, isContract)

  const tokenPriceInfo = useTokenPrice(account?.ticker || Ticker.ROSE)

  const tokenTransfersLink = useHref(`token-transfers#${accountTokenTransfersContainerId}`)
  const erc20Link = useHref(`tokens/erc-20#${accountTokenContainerId}`)
  const erc721Link = useHref(`tokens/erc-721#${accountTokenContainerId}`)

  const txLink = useHref('')
  const showCode = isContract
  const codeLink = useHref(`code#${contractCodeContainerId}`)

  const isLoading = isAccountLoading || isTokenLoading

  const context: AccountDetailsContext = { scope, address }

  return (
    <PageLayout>
      <SubPageCard
        featured
        isLoadingTitle={isLoading}
        title={isContract ? t('contract.title') : t('account.title')}
      >
        <AccountDetailsView
          isLoading={isLoading}
          isError={isError}
          account={account}
          token={token}
          tokenPriceInfo={tokenPriceInfo}
        />
      </SubPageCard>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          { label: t('tokens.transfers'), to: tokenTransfersLink },
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

export const AccountDetailsView: FC<{
  isLoading: boolean
  isError: boolean
  account: RuntimeAccount | undefined
  token?: EvmToken
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}> = ({ isLoading, isError, account, token, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  return isError ? (
    <CardEmptyState label={t('account.cantLoadDetails')} />
  ) : (
    <Account
      account={account}
      token={token}
      isLoading={isLoading}
      tokenPriceInfo={tokenPriceInfo}
      showLayer={showLayer}
    />
  )
}
