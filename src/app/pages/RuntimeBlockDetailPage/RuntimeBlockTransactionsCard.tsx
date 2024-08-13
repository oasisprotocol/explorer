import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { RuntimeTransactions } from '../../components/Transactions'
import { AppErrors } from '../../../types/errors'
import { RuntimeBlockDetailsContext } from '.'

export const transactionsContainerId = 'transactions'

const TransactionList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  if (scope.layer === Layer.consensus) {
    // Loading transactions for consensus blocks is not yet supported.
    // Should use useGetConsensusTransactions()
    throw AppErrors.UnsupportedLayer
  }
  const transactionsQuery = useGetRuntimeTransactions(scope.network, scope.layer, {
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
    <RuntimeTransactions
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

export const RuntimeBlockTransactionsCard: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()

  if (!blockHeight) {
    return null
  }

  return (
    <LinkableCardLayout containerId={transactionsContainerId} title={t('common.transactions')}>
      <TransactionList scope={scope} blockHeight={blockHeight} />
    </LinkableCardLayout>
  )
}
