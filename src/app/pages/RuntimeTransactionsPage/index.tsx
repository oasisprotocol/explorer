import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableRuntimeTransactionList, RuntimeTransactions } from '../../components/Transactions'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'
import { AppErrors } from '../../../types/errors'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { RuntimeTransactionDetailView } from '../RuntimeTransactionDetailPage'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useAllTokenPrices } from '../../../coin-gecko/api'
import { VerticalList } from '../../components/VerticalList'
import { getFiatCurrencyForScope } from '../../../config'
import { useRuntimeListBeforeDate } from '../../hooks/useListBeforeDate'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import Box from '@mui/material/Box'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const RuntimeTransactionsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const pagination = useSearchParamsPagination('page')
  const { method, setMethod } = useRuntimeTxMethodParam()
  const offset = (pagination.selectedPage - 1) * limit
  const scope = useRequiredScopeParam()
  const enablePolling = offset === 0
  const { beforeDate, setBeforeDateFromCollection } = useRuntimeListBeforeDate(scope, offset)
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet implemented.
    // we should call useGetConsensusTransactions()
  }

  const tokenPrices = useAllTokenPrices(getFiatCurrencyForScope(scope))

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
      before: enablePolling ? undefined : beforeDate,
      ...getRuntimeTransactionMethodFilteringParam(method),
    },
    {
      query: {
        enabled: enablePolling || !!beforeDate,
        refetchInterval: enablePolling ? REFETCH_INTERVAL : undefined,
        structuralSharing: enablePolling
          ? (previousState, nextState) => {
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
            }
          : undefined,
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  const { isLoading, isFetched, data } = transactionsQuery

  const transactions = data?.data.transactions
  setBeforeDateFromCollection(transactions?.[0]?.timestamp)

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
        title={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t('transactions.latest')}
            {!isMobile && (
              <RuntimeTransactionTypeFilter layer={scope.layer} value={method} setValue={setMethod} />
            )}
          </Box>
        }
        title2={
          isMobile ? (
            <RuntimeTransactionTypeFilter layer={scope.layer} value={method} setValue={setMethod} expand />
          ) : undefined
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
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
            filtered={method !== 'any'}
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
                  tokenPrices={tokenPrices}
                  standalone
                />
              ))}

            {!isLoading &&
              data?.data.transactions.map(tx => (
                <RuntimeTransactionDetailView
                  key={tx.hash}
                  transaction={tx}
                  tokenPrices={tokenPrices}
                  standalone
                />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
