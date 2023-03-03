import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Runtime, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { Transactions } from '../../components/Transactions'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const transactionsContainerId = 'transactions'

const TransactionList: FC<{ blockHeight: number }> = ({ blockHeight }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetRuntimeTransactions(Runtime.emerald, {
    block: blockHeight,
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
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
      verbose={false}
    />
  )
}

export const TransactionsCard: FC<{ blockHeight: number }> = ({ blockHeight }) => {
  const { t } = useTranslation()
  return (
    <Card id={transactionsContainerId}>
      <CardHeader disableTypography component="h3" title={t('common.transactions')} />
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionList blockHeight={blockHeight} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
