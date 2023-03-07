import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableRuntimeTransactionList, Transactions } from '../../components/Transactions'
import { Runtime, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AxiosResponse } from 'axios'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const TransactionsPage: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit

  const transactionsQuery = useGetRuntimeTransactions<AxiosResponse<TableRuntimeTransactionList>>(
    Runtime.emerald,
    { limit, offset },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          const oldTxHashes = new Set(previousState?.data.transactions.map(tx => tx.hash))
          return {
            ...nextState,
            data: {
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
    <PageLayout>
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard title={t('transactions.latest')}>
        <Transactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={{
            selectedPage: pagination.selectedPage,
            linkToPage: pagination.linkToPage,
          }}
        />
      </SubPageCard>
    </PageLayout>
  )
}
