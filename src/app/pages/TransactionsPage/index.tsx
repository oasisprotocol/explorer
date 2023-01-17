import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TableRuntimeTransactionList, Transactions } from '../../components/Transactions'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { AxiosResponse } from 'axios'
import { useSearchParams } from 'react-router-dom'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const TransactionsPage: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [searchParams] = useSearchParams()
  const selectedPage = parseInt(searchParams.get('page') ?? '1', 10)
  const offset = (selectedPage - 1) * limit
  const transactionsQuery = useGetEmeraldTransactions<AxiosResponse<TableRuntimeTransactionList>>(
    { limit, offset },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          const oldTxHashes = new Set(previousState?.data?.transactions?.map(tx => tx.hash!))
          return {
            ...nextState,
            data: {
              transactions: nextState.data?.transactions?.map(tx => {
                return {
                  ...tx,
                  markAsNew: previousState ? !oldTxHashes.has(tx.hash!) : false,
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
        />
      </SubPageCard>
    </PageLayout>
  )
}
