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

export const LatestTransactions: FC = () => {
  const { t } = useTranslation()
  const transactionsQuery = useGetEmeraldTransactions({ limit: 5 })
  const tableColumns = [
    { content: t('common.table.status') },
    { content: t('common.table.hash') },
    { content: t('common.table.block') },
    { content: t('common.table.age') },
    { content: t('common.table.type') },
    { content: t('common.table.from') },
    { content: t('common.table.to') },
    { content: t('common.table.txnFee') },
    { content: t('common.table.value') },
  ]
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
        content: <RuntimeTransactionLabel method={transaction.method!} />,
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
        content: t('common.table.valueInRose', { value: transaction.fee_amount }),
        key: 'fee_amount',
      },
      {
        align: TableCellAlign.Right,
        content: t('common.table.valueInRose', { value: transaction.amount }),
        key: 'value',
      },
    ],
  }))

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
        <Table
          columns={tableColumns}
          rows={tableRows}
          name={t('transactions.latest')}
          isLoading={transactionsQuery.isLoading}
        />
      </CardContent>
    </Card>
  )
}
