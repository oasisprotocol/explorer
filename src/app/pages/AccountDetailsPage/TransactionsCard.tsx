import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { PaginationError } from '../../components/Table/PaginationError'

export const TransactionsCard: FC = () => {
  const { t } = useTranslation()
  const address = useLoaderData() as string
  const txsPagination = useSearchParamsPagination('page')
  if (!txsPagination.valid) return <PaginationError />
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetEmeraldTransactions({
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
    rel: address,
  })

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      <CardContent>
        <Transactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
          pagination={{
            selectedPage: txsPagination.selectedPage,
            linkToPage: txsPagination.linkToPage,
          }}
        />
      </CardContent>
    </Card>
  )
}
