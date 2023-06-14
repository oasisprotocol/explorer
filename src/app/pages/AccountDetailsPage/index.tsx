import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { TokenPriceInfo, useTokenPrice } from '../../../coin-gecko/api'
import { Ticker } from '../../../types/ticker'

import { EvmTokenType, RuntimeAccount } from '../../../oasis-indexer/api'
import { accountTokenContainerId } from './TokensCard'
import { useAccount } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { showEmptyAccountDetails } from '../../../config'
import { CardEmptyState } from './CardEmptyState'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { account, isLoading, isError } = useAccount(scope, address)

  const tokenPriceInfo = useTokenPrice(account?.ticker || Ticker.ROSE)

  const showErc20 = showEmptyAccountDetails || !!account?.tokenBalances[EvmTokenType.ERC20].length
  const erc20Link = useHref(`tokens/erc-20#${accountTokenContainerId}`)
  const showErc721 = showEmptyAccountDetails || !!account?.tokenBalances[EvmTokenType.ERC721].length
  const erc721Link = useHref(`tokens/erc-721#${accountTokenContainerId}`)
  const showTxs = showEmptyAccountDetails || showErc20 || showErc721 || !!account?.stats.num_txns
  const txLink = useHref('')

  const showDetails = showTxs || showErc20 || showErc721

  return (
    <PageLayout>
      <SubPageCard featured title={t('account.title')}>
        <AccountDetailsView
          isLoading={isLoading}
          isError={isError}
          account={account}
          tokenPriceInfo={tokenPriceInfo}
        />
      </SubPageCard>
      {showDetails && (
        <RouterTabs
          tabs={[
            { label: t('common.transactions'), to: txLink, visible: showTxs },
            { label: t('account.ERC20'), to: erc20Link, visible: showErc20 },
            { label: t('account.ERC721'), to: erc721Link, visible: showErc721 },
          ]}
        />
      )}
    </PageLayout>
  )
}

export const AccountDetailsView: FC<{
  isLoading: boolean
  isError: boolean
  account: RuntimeAccount | undefined
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}> = ({ isLoading, isError, account, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  return isError ? (
    <CardEmptyState label={t('account.cantLoadDetails')} />
  ) : (
    <Account account={account} isLoading={isLoading} tokenPriceInfo={tokenPriceInfo} showLayer={showLayer} />
  )
}
