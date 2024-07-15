import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusTransactions } from '../../components/Transactions'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ScrollingCard } from '../../components/PageLayout/ScrollingCard'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'

export const transactionsContainerId = 'transactions'

const TransactionList: FC<{ scope: SearchScope; blockHeight: number }> = ({ scope, blockHeight }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetConsensusTransactions(scope.network, {
    block: blockHeight,
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
  })
  const { isLoading, isFetched, data } = transactionsQuery
  const transactions = data?.data.transactions

  if (isFetched && txsPagination.selectedPage > 1 && !transactions?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <ConsensusTransactions
      transactions={transactions}
      isLoading={isLoading}
      limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
      pagination={{
        selectedPage: txsPagination.selectedPage,
        linkToPage: txsPagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      }}
    />
  )
}

export const TransactionsCard: FC<{ scope: SearchScope; blockHeight: number }> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()
  return (
    <ScrollingCard id={transactionsContainerId}>
      <CardHeader disableTypography component="h3" title={t('common.transactions')} />
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionList scope={scope} blockHeight={blockHeight} />
        </ErrorBoundary>
      </CardContent>
    </ScrollingCard>
  )
}
