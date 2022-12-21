import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { trimLongString } from '../../utils/trimLongString'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'

const tableColumns = [
  { content: 'Status' },
  { content: 'Hash' },
  { content: 'Block' },
  { content: 'Age' },
  { content: 'Type' },
  { content: 'From' },
  { content: 'To' },
  { content: 'Txn Fee' },
  { content: 'Value' },
]

export const LatestTransactions: FC = () => {
  const transactionsQuery = useGetEmeraldTransactions({ limit: 5 })
  const tableRows = transactionsQuery.data?.data.transactions?.map(transaction => ({
    key: transaction.hash!,
    data: [
      {
        content: <TransactionStatusIcon success={transaction.success!} />,
        key: 'success',
      },
      {
        content: (
          <Link component={RouterLink} to="transaction">
            {trimLongString(transaction.hash!, 4, 4, '-')}
          </Link>
        ),

        key: 'hash',
      },
      {
        content: (
          <Link component={RouterLink} to="block">
            {transaction.round}
          </Link>
        ),
        key: 'round',
      },
      {
        content: '-',
        key: 'age',
      },
      {
        content: transaction.method,
        key: 'type',
      },
      {
        content: (
          <Link component={RouterLink} to="account">
            {trimLongString(transaction.sender_0!, 10, 0)}
          </Link>
        ),

        key: 'from',
      },
      {
        content: (
          <Link component={RouterLink} to="account">
            {trimLongString(transaction.to!, 10, 0)}
          </Link>
        ),
        key: 'to',
      },
      {
        align: TableCellAlign.Right,
        content: `${transaction.fee_amount} ROSE`,
        key: 'fee_amount',
      },
      {
        align: TableCellAlign.Right,
        content: `${transaction.amount} ROSE`,
        key: 'value',
      },
    ],
  }))

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title="Latest Transactions"
        action={
          <Link component={RouterLink} to="transactions">
            View all
          </Link>
        }
      />
      <CardContent>
        <Table
          columns={tableColumns}
          rows={tableRows}
          name="Latest Transactions"
          isLoading={transactionsQuery.isLoading}
        />
      </CardContent>
    </Card>
  )
}
