import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableConsensusTransactionList, ConsensusTransactions } from '../../components/Transactions'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit, REFETCH_INTERVAL } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'
import { AppErrors } from '../../../types/errors'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { useConsensusScope } from '../../hooks/useScopeParam'
import { VerticalList } from '../../components/VerticalList'
import { ConsensusTransactionDetailView } from '../ConsensusTransactionDetailPage'
import { useConsensusListBeforeDate } from '../../hooks/useListBeforeDate'
import { useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { ConsensusTransactionMethodFilter } from '../../components/Transactions/ConsensusTransactionMethodFilter'
import { getConsensusTransactionMethodFilteringParam } from '../../components/ConsensusTransactionMethod'
import { LayoutDivider } from '../../components/Divider'

export const ConsensusTransactionsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const pagination = useSearchParamsPagination('page')
  const { txMethod, setTxMethod } = useConsensusTxMethodParam()
  const offset = (pagination.selectedPage - 1) * limit
  const scope = useConsensusScope()
  const enablePolling = offset === 0
  const { beforeDate, setBeforeDateFromCollection } = useConsensusListBeforeDate(scope, offset)

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const transactionsQuery = useGetConsensusTransactions<AxiosResponse<TableConsensusTransactionList>>(
    scope.network,
    {
      limit: tableView === TableLayout.Vertical ? offset + limit : limit,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
      before: enablePolling ? undefined : beforeDate,
      ...getConsensusTransactionMethodFilteringParam(txMethod),
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
          <div className="flex gap-6 items-center">
            {t('transactions.latest')}
            {!isMobile && <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} />}
          </div>
        }
        title2={
          isMobile ? (
            <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} expand />
          ) : undefined
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <ConsensusTransactions
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
            verbose={false}
            filtered={txMethod !== 'any'}
          />
        )}

        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(limit).keys()].map(key => (
                <ConsensusTransactionDetailView key={key} isLoading={true} transaction={undefined} />
              ))}
            {!isLoading &&
              transactions?.map(transaction => (
                <ConsensusTransactionDetailView key={transaction.hash} transaction={transaction} />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
