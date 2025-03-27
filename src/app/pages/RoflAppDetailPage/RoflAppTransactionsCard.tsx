import { FC } from 'react'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { transactionsContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import { RoflAppDetailsContext, useRoflAppTransactions } from './hooks'

export const RoflAppTransactionsCard: FC<RoflAppDetailsContext> = context => {
  const { method, setMethod, scope } = context

  const { isMobile } = useScreenSize()

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
            <RuntimeTransactionTypeFilter layer={scope.layer} value={method} setValue={setMethod} />
          )}
        </Box>
      }
    >
      {isMobile && (
        <RuntimeTransactionTypeFilter layer={scope.layer} value={method} setValue={setMethod} expand />
      )}
      <RoflAppTransactions {...context} />
    </LinkableCardLayout>
  )
}

const RoflAppTransactions: FC<RoflAppDetailsContext> = ({ scope, id, method }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } = useRoflAppTransactions(
    scope,
    id,
    method,
  )
  return (
    <RuntimeTransactions
      transactions={transactions}
      ownAddress={id}
      isLoading={isLoading}
      limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount,
        isTotalCountClipped,
        rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      }}
      filtered={method !== 'any'}
    />
  )
}
