import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { trimLongString } from '../../utils/trimLongString'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { Transactions } from '../../components/Transactions'

const limit = 5

export const LatestTransactions: FC = () => {
  const { t } = useTranslation()
  const transactionsQuery = useGetEmeraldTransactions({ limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('transactions.latest')}
        action={
          <Link component={RouterLink} to="transactions">
            View all
          </Link>
        }
      />
      <CardContent>
        <Transactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
