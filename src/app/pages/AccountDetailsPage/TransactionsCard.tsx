import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, NUMBER_OF_ITEMS_WITH_NEXT_PAGE_VALIDATION } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'

export const TransactionsCard: FC = () => {
  const { t } = useTranslation()
  const address = useLoaderData() as string
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetEmeraldTransactions({
    limit: NUMBER_OF_ITEMS_WITH_NEXT_PAGE_VALIDATION,
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
            prevNextOnly: true,
            hasMore:
              transactionsQuery.data?.data.transactions.length === NUMBER_OF_ITEMS_WITH_NEXT_PAGE_VALIDATION,
            selectedPage: txsPagination.selectedPage,
            linkToPage: txsPagination.linkToPage,
          }}
        />
      </CardContent>
    </Card>
  )
}
