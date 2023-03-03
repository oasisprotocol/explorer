import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { Runtime, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const TransactionsList: FC<{ address: string }> = ({ address }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetRuntimeTransactions(Runtime.emerald, {
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
    rel: address,
  })
  return (
    <Transactions
      transactions={transactionsQuery.data?.data.transactions}
      isLoading={transactionsQuery.isLoading}
      limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
      pagination={{
        selectedPage: txsPagination.selectedPage,
        linkToPage: txsPagination.linkToPage,
      }}
    />
  )
}

export const TransactionsCard: FC = () => {
  const { t } = useTranslation()
  const address = useLoaderData() as string
  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionsList address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
