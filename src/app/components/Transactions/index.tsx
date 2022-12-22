import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { trimLongString } from '../../utils/trimLongString'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { RuntimeTransactionList } from '../../../oasis-indexer/generated/api'

type TransactionProps = RuntimeTransactionList & {
  isLoading: boolean
  limit: number
  numberOfAllTransactions?: number
}

export const Transactions: FC<TransactionProps> = ({
  isLoading,
  limit,
  numberOfAllTransactions = 0,
  transactions,
}) => {
  const { t } = useTranslation()

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
  const tableRows = transactions?.map(transaction => ({
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
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('transactions.latest')}
      isLoading={isLoading}
      pagination={{
        numberOfAllTransactions,
      }}
    />
  )
}
