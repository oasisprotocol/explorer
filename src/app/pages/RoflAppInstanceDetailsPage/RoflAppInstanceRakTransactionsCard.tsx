import { FC } from 'react'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { transactionsContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import { RoflAppInstanceDetailsContext, useRoflAppInstanceRakTransactions } from './hooks'

export const RoflAppInstanceRakTransactionsCard: FC<RoflAppInstanceDetailsContext> = context => {
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
      <RoflAppInstanceRakTransactions {...context} />
    </LinkableCardLayout>
  )
}

const RoflAppInstanceRakTransactions: FC<RoflAppInstanceDetailsContext> = ({ scope, id, rak, method }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } =
    useRoflAppInstanceRakTransactions(scope, id, rak, method)

  return (
    <RuntimeTransactions
      transactions={transactions}
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
