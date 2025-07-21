import { FC } from 'react'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { updatesContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import { RoflAppDetailsContext, useRoflAppInstanceTransactions } from './hooks'

export const RoflAppInstanceTransactionsCard: FC<RoflAppDetailsContext> = context => {
  const { txMethod, setTxMethod, scope } = context

  const { isMobile } = useScreenSize()

  return (
    <LinkableCardLayout
      containerId={updatesContainerId}
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {!isMobile && (
            <RuntimeTransactionTypeFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} />
          )}
        </Box>
      }
    >
      {isMobile && (
        <RuntimeTransactionTypeFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} expand />
      )}
      <RoflAppInstanceTransactions {...context} />
    </LinkableCardLayout>
  )
}

const RoflAppInstanceTransactions: FC<RoflAppDetailsContext> = ({ scope, id, txMethod }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } =
    useRoflAppInstanceTransactions(scope, id, txMethod)
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
      filtered={txMethod !== 'any'}
    />
  )
}
