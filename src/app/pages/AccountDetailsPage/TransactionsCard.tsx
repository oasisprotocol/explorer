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
import { useLayerParam } from '../../hooks/useLayerParam'

export const TransactionsList: FC<{ layer: Layer; address: string }> = ({ layer, address }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Loading transactions on the consensus layer is not supported yet.
    // We should use useGetConsensusTransactions()
  }
  const transactionsQuery = useGetRuntimeTransactions(
    layer, // This is OK since consensus has been handled separately
    {
      limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      offset: txsOffset,
      rel: address,
    },
  )

  return (
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
  )
}

export const TransactionsCard: FC = () => {
  const { t } = useTranslation()
  const layer = useLayerParam()
  const address = useLoaderData() as string
  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      <CardContent>
        <ErrorBoundary light={true}>
          <TransactionsList layer={layer} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
