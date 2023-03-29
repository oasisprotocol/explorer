import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { Transactions } from '../../components/Transactions'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { AppErrors } from '../../../types/errors'

export const transactionsContainerId = 'transactions'

const TransactionList: FC<{ layer: Layer; blockHeight: number }> = ({ layer, blockHeight }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    // Loading transactions for consensus blocks is not yet supported.
    // Should use useGetConsensusTransactions()
    throw AppErrors.UnsupportedLayer
  }
  const transactionsQuery = useGetRuntimeTransactions(layer, {
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
        totalCount: transactionsQuery.data?.data.total_count,
        isTotalCountClipped: transactionsQuery.data?.data.is_total_count_clipped,
        rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      }}
      verbose={false}
    />
  )
}

export const TransactionsCard: FC<{ layer: Layer; blockHeight: number }> = ({ layer, blockHeight }) => {
  const { t } = useTranslation()
  return (
    <Card id={transactionsContainerId}>
      <CardHeader disableTypography component="h3" title={t('common.transactions')} />
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionList layer={layer} blockHeight={blockHeight} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
