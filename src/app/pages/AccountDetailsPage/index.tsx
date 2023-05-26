import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { RuntimeAccount } from '../../../oasis-indexer/api'
import { accountTokenContainerId } from './TokensCard'
import { useAccount } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { account, isLoading } = useAccount(scope, address)

  const rosePriceQuery = useGetRosePrice()

  return (
    <PageLayout>
      <SubPageCard featured title={t('account.title')}>
        <AccountDetailsView isLoading={isLoading} account={account} roseFiatValue={rosePriceQuery.data} />
      </SubPageCard>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: useHref('') },
          { label: t('account.ERC20'), to: useHref(`tokens/erc-20#${accountTokenContainerId}`) },
          { label: t('account.ERC721'), to: useHref(`tokens/erc-721#${accountTokenContainerId}`) },
        ]}
      />
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
