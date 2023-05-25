import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { AppErrors } from '../../../types/errors'
import { ScrollingDiv } from '../../components/PageLayout/ScrollingDiv'
import { CardEmptyState } from './CardEmptyState'
import { SearchScope } from '../../../types/searchScope'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'

export const TransactionsList: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }
  const transactionsQuery = useGetRuntimeTransactions(
    network,
    layer, // This is OK since consensus has been handled separately
    {
      limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      offset: txsOffset,
      rel: address,
    },
  )

  return (
    <>
      {transactionsQuery.isFetched && !transactionsQuery.data?.data.transactions.length && (
        <CardEmptyState label={t('account.emptyTransactionList')} />
      )}
      <Transactions
        transactions={transactionsQuery.data?.data.transactions}
        ownAddress={address}
        isLoading={transactionsQuery.isLoading}
        limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
        pagination={{
          selectedPage: txsPagination.selectedPage,
          linkToPage: txsPagination.linkToPage,
          totalCount: transactionsQuery.data?.data.total_count,
          isTotalCountClipped: transactionsQuery.data?.data.is_total_count_clipped,
          rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
        }}
      />
    </>
  )
}

export const accountTransactionsContainerId = 'transactions'

export const TransactionsCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  return (
    <Card>
      <ScrollingDiv id={accountTransactionsContainerId}>
        <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      </ScrollingDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionsList scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
