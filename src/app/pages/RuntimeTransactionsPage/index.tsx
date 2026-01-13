import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { RuntimeTransactions } from '../../components/Transactions/RuntimeTransactions'
import { TableRuntimeTransactionList } from '../../components/Transactions/types'
import { useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'
import { AppErrors } from '../../../types/errors'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayoutButton } from '../../components/TableLayoutButton'
import { TableLayout } from '../../components/Table/types'
import { RuntimeTransactionDetailView } from '../RuntimeTransactionDetailPage'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useAllTokenPrices } from '../../../coin-gecko/api'
import { VerticalList } from '../../components/VerticalList'
import { getFiatCurrencyForScope } from '../../../config'
import { useRuntimeListBeforeDate } from '../../hooks/useListBeforeDate'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod/helpers'
import { LayoutDivider } from '../../components/Divider'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const RuntimeTransactionsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const pagination = useSearchParamsPagination('page')
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()
  const offset = (pagination.selectedPage - 1) * limit
  const scope = useRuntimeScope()
  const enablePolling = offset === 0
  const { beforeDate, setBeforeDateFromCollection } = useRuntimeListBeforeDate(scope, offset)

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
      ...getRuntimeTransactionMethodFilteringParam(txMethod),
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
      {!isMobile && <LayoutDivider />}
      <SubPageCard
        title={
          <div className="flex items-center gap-6">
            {t('transactions.latest')}
            {!isMobile && (
              <RuntimeTransactionMethodFilter layer={scope.layer} value={txMethod} setValue={setTxMethod} />
            )}
          </div>
        }
        title2={
          isMobile ? (
            <RuntimeTransactionMethodFilter
              layer={scope.layer}
              value={txMethod}
              setValue={setTxMethod}
              expand
            />
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
            filtered={txMethod !== 'any'}
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
