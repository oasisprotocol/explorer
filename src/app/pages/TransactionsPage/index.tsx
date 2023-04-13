import { FC, useEffect, useState } from 'react'
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
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
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
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactions()
  }

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const transactionsQuery = useGetRuntimeTransactions<AxiosResponse<TableRuntimeTransactionList>>(
    layer, // This is OK, since consensus is already handled separately
    {
      limit: tableView === TableLayout.Vertical ? offset + limit : limit,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
    },
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
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && (
          <LoadMoreButton pagination={pagination} isLoading={transactionsQuery.isLoading} />
        )
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('transactions.latest')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
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

        {tableView === TableLayout.Vertical && (
          <TransactionDetails>
            {transactionsQuery.isLoading &&
              [...Array(limit).keys()].map(key => (
                <TransactionDetailView key={key} isLoading={true} transaction={undefined} standalone />
              ))}

            {!transactionsQuery.isLoading &&
              transactionsQuery.data?.data.transactions.map(tx => (
                <TransactionDetailView key={tx.hash} transaction={tx} standalone />
              ))}
          </TransactionDetails>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
