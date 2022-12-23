import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { PageLayout } from '../../components/PageLayout'
import { Transactions } from '../../components/Transactions'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const TransactionsPage: FC = () => {
  const { t } = useTranslation()
  const transactionsQuery = useGetEmeraldTransactions({ limit: limit })

  return (
    <PageLayout>
      <Card>
        <CardHeader disableTypography component="h3" title={t('transactions.latest')} />
        <CardContent>
          <Transactions
            transactions={transactionsQuery.data?.data.transactions}
            isLoading={transactionsQuery.isLoading}
            limit={limit}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
