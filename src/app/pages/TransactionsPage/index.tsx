import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Transactions } from '../../components/Transactions'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const TransactionsPage: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const transactionsQuery = useGetEmeraldTransactions(
    { limit: limit },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          if (!previousState) {
            return nextState
          }
          return {
            ...nextState,
            data: {
              transactions: nextState.data?.transactions?.map(tx => {
                return {
                  ...tx,
                  markAsNew: !previousState.data?.transactions?.some(prevTx => prevTx.hash === tx.hash),
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
