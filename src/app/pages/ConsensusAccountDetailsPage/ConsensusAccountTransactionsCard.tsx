import { FC } from 'react'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { ConsensusTransactions } from '../../components/Transactions'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusAccountDetailsContext } from './hooks'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'
import { useScreenSize } from '../../hooks/useScreensize'
import { ConsensusTransactionMethodFilter } from '../../components/Transactions/ConsensusTransactionMethodFilter'
import Box from '@mui/material/Box'
import { transactionsContainerId } from '../../utils/tabAnchors'

export const ConsensusAccountTransactionsCard: FC<ConsensusAccountDetailsContext> = context => {
  const { isMobile } = useScreenSize()
  const { txMethod, setTxMethod } = context

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
          {!isMobile && <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} />}
        </Box>
      }
    >
      {isMobile && <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} expand />}
      <ConsensusAccountTransactions {...context} />
    </LinkableCardLayout>
  )
}

const ConsensusAccountTransactions: FC<ConsensusAccountDetailsContext> = ({ scope, address, txMethod }) => {
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const transactionsQuery = useGetConsensusTransactions(network, {
    limit,
    offset,
    rel: address,
    method: txMethod === 'any' ? undefined : txMethod,
  })
  const { isLoading, data } = transactionsQuery
  const transactions = data?.data.transactions

  return (
    <ConsensusTransactions
      transactions={transactions}
      ownAddress={address}
      isLoading={isLoading}
      limit={limit}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
      filtered={txMethod !== 'any'}
    />
  )
}
