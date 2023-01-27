import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams } from 'react-router-dom'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { RouterTabs } from '../../components/RouterTabs'
import { useGetConsensusAccountsAddress } from '../../../oasis-indexer/api'
import { useGetRosePrice } from '../../../coin-gecko/api'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { address } = useParams()
  // TODO: switch to Emerald when API is ready
  const accountQuery = useGetConsensusAccountsAddress(address!)
  const account = accountQuery.data?.data
  const rosePriceQuery = useGetRosePrice()

  return (
    <PageLayout>
      <SubPageCard featured title={t('account.title')}>
        {accountQuery.isLoading && <Skeleton variant="text" height={30} sx={{ my: 4 }} />}
        {account && (
          <CardContent>
            <Account account={account} roseFiatValue={rosePriceQuery.data} />
          </CardContent>
        )}
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
