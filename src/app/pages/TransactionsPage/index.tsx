import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableRuntimeTransactionList, Transactions } from '../../components/Transactions'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableView, TableViewSpeedDial } from '../../components/TableViewSpeedDial'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { TransactionDetailView } from '../TransactionDetailPage'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const TransactionDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: COLORS.persianBlue,
}))

export const TransactionsPage: FC = () => {
  const [tableView, setTableView] = useState<TableView>(TableView.Horizontal)
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_PARA_TIMES, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactions()
  }
  const transactionsQuery = useGetRuntimeTransactions<AxiosResponse<TableRuntimeTransactionList>>(
    layer, // This is OK, since consensus is already handled separately
    { limit, offset },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          const oldTxHashes = new Set(previousState?.data.transactions.map(tx => tx.hash))
          return {
            ...nextState,
            data: {
              ...nextState.data,
              transactions: nextState.data.transactions.map(tx => {
                return {
                  ...tx,
                  markAsNew: previousState ? !oldTxHashes.has(tx.hash) : false,
                }
              }),
            },
          }
        },
      },
    },
  )

  return (
    <PageLayout
      mobileFooterAction={<LoadMoreButton pagination={pagination} isLoading={transactionsQuery.isLoading} />}
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('transactions.latest')}
        action={isMobile && <TableViewSpeedDial tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableView.Vertical}
      >
        {tableView === TableView.Horizontal && (
          <Transactions
            transactions={transactionsQuery.data?.data.transactions}
            isLoading={transactionsQuery.isLoading}
            limit={limit}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: transactionsQuery.data?.data.total_count,
              isTotalCountClipped: transactionsQuery.data?.data.is_total_count_clipped,
              rowsPerPage: limit,
            }}
          />
        )}

        {tableView === TableView.Vertical && (
          <TransactionDetails>
            {transactionsQuery.data?.data.transactions.map(tx => (
              <SubPageCard featured key={tx.hash} noPadding>
                <TransactionDetailView isLoading={false} transaction={tx} withPadding />
              </SubPageCard>
            ))}
          </TransactionDetails>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
