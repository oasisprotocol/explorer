import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { Layer, RuntimeAccount, useGetRuntimeAccountsAddress } from '../../../oasis-indexer/api'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()

  const layer = useLayerParam()
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading consensus
    // We should use useGetConsensusAccountsAddress()
  }
  const address = useLoaderData() as string
  const accountQuery = useGetRuntimeAccountsAddress(layer, address)
  const account = accountQuery.data?.data
  const rosePriceQuery = useGetRosePrice()

  return (
    <PageLayout>
      <SubPageCard featured title={t('account.title')}>
        <AccountDetailsView
          isLoading={accountQuery.isLoading}
          account={account}
          roseFiatValue={rosePriceQuery.data}
        />
      </SubPageCard>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: useHref('') },
          { label: t('account.ERC20'), to: useHref('tokens/erc-20') },
          { label: t('account.ERC721'), to: useHref('tokens/erc-721') },
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
