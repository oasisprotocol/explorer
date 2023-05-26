import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { EvmTokenType, RuntimeAccount } from '../../../oasis-indexer/api'
import { accountTokenContainerId } from './TokensCard'
import { useAccount } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { showEmptyAccountDetails } from '../../../config'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { account, isLoading } = useAccount(scope, address)

  const rosePriceQuery = useGetRosePrice()

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
        <AccountDetailsView isLoading={isLoading} account={account} roseFiatValue={rosePriceQuery.data} />
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
  account: RuntimeAccount | undefined
  roseFiatValue: number | undefined
  showLayer?: boolean
}> = ({ isLoading, account, roseFiatValue, showLayer }) => {
  return (
    <Account account={account} isLoading={isLoading} roseFiatValue={roseFiatValue} showLayer={showLayer} />
  )
}
