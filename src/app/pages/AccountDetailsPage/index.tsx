import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Account } from '../../components/Account'
import { Transactions } from '../../components/Transactions'
import { useGetConsensusAccountsAddress } from '../../../oasis-indexer/api'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'

export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { address } = useParams()
  // switch to Emerald when API is ready
  const accountQuery = useGetConsensusAccountsAddress(address!)
  const account = accountQuery.data?.data
  const transactionsQuery = useGetEmeraldTransactions({
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    // filtering is not implemented in API yet
    // @ts-expect-error
    rel: address,
  })

  return (
    <PageLayout>
      <SubPageCard featured title={t('account.title')}>
        {accountQuery.isLoading && <Skeleton variant="text" height={30} sx={{ my: 4 }} />}
        {account && (
          <CardContent>
            <Account account={account} />
          </CardContent>
        )}
      </SubPageCard>
      <Card>
        <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
        <CardContent>
          <Transactions
            transactions={transactionsQuery.data?.data.transactions}
            isLoading={transactionsQuery.isLoading}
            limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
            pagination={true}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
