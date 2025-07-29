import { FC } from 'react'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { RuntimeTransactions } from '../../components/Transactions'
import { AppErrors } from '../../../types/errors'
import { RuntimeBlockDetailsContext } from '.'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import Box from '@mui/material/Box'
import { transactionsContainerId } from '../../utils/tabAnchors'

const TransactionList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight, txMethod }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

  const transactionsQuery = useGetRuntimeTransactions(scope.network, scope.layer, {
    block: blockHeight,
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
    ...getRuntimeTransactionMethodFilteringParam(txMethod),
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
      filtered={txMethod !== 'any'}
    />
  )
}

export const RuntimeBlockTransactionsCard: FC<RuntimeBlockDetailsContext> = props => {
  const { isMobile } = useScreenSize()
  const { blockHeight, txMethod, setTxMethod, scope } = props

  if (!blockHeight) {
    return null
  }

  return (
    <LinkableCardLayout
      containerId={transactionsContainerId}
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {!isMobile && (
            <RuntimeTransactionMethodFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} />
          )}
        </Box>
      }
    >
      {isMobile && (
        <RuntimeTransactionMethodFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} expand />
      )}
      <TransactionList {...props} />
    </LinkableCardLayout>
  )
}
