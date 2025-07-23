import { FC } from 'react'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useAccountTransactions } from './hook'
import { RuntimeAccountDetailsContext } from './index'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import Box from '@mui/material/Box'
import { transactionsContainerId } from '../../utils/tabAnchors'

export const AccountTransactionsCard: FC<RuntimeAccountDetailsContext> = context => {
  const { txMethod, setTxMethod, scope } = context

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
            <RuntimeTransactionMethodFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} />
          )}
        </Box>
      }
    >
      {isMobile && (
        <RuntimeTransactionMethodFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} expand />
      )}
      <AccountTransactions {...context} />
    </LinkableCardLayout>
  )
}

const AccountTransactions: FC<RuntimeAccountDetailsContext> = ({ scope, address, txMethod }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } = useAccountTransactions(
    scope,
    address,
    txMethod,
  )
  return (
    <RuntimeTransactions
      transactions={transactions}
      ownAddress={address}
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
