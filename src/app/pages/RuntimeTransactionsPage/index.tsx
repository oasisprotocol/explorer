import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableRuntimeTransactionList, RuntimeTransactions } from '../../components/Transactions'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'
import { AppErrors } from '../../../types/errors'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { RuntimeTransactionDetailView } from '../RuntimeTransactionDetailPage'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTokenPrice } from '../../../coin-gecko/api'
import { getTickerForNetwork } from '../../../types/ticker'
import { VerticalList } from '../../components/VerticalList'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const RuntimeTransactionsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const scope = useRequiredScopeParam()

  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactions()
  }

  const tokenPriceInfo = useTokenPrice(getTickerForNetwork(scope.network))

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const transactionsQuery = useGetRuntimeTransactions<AxiosResponse<TableRuntimeTransactionList>>(
    scope.network,
    scope.layer, // This is OK, since consensus is already handled separately
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

  const { isLoading, isFetched, data } = transactionsQuery

  const transactions = data?.data.transactions

  if (isFetched && pagination.selectedPage > 1 && !transactions?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('transactions.latest')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
          <RuntimeTransactions
            transactions={data?.data.transactions}
            isLoading={isLoading}
            limit={limit}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: limit,
            }}
          />
        )}

        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(limit).keys()].map(key => (
                <RuntimeTransactionDetailView
                  key={key}
                  isLoading={true}
                  transaction={undefined}
                  tokenPriceInfo={tokenPriceInfo}
                  standalone
                />
              ))}

            {!isLoading &&
              data?.data.transactions.map(tx => (
                <RuntimeTransactionDetailView
                  key={tx.hash}
                  transaction={tx}
                  tokenPriceInfo={tokenPriceInfo}
                  standalone
                />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
