import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Transaction } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoundedBalance } from '../../components/RoundedBalance'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusIcon } from '../StatusIcon'
import { Age } from '../Age'
import { TransactionLink } from './TransactionLink'
import { ConsensusTransactionMethod } from '../ConsensusTransactionMethod'
import { ConsensusTransactionDetails } from './ConsensusTransactionDetails'

type TableConsensusTransaction = Transaction & {
  markAsNew?: boolean
}

export type TableConsensusTransactionList = {
  transactions: TableConsensusTransaction[]
  total_count: number
  is_total_count_clipped: boolean
}

type ConsensusTransactionsProps = {
  transactions?: TableConsensusTransaction[]
  ownAddress?: string
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  verbose?: boolean
}

export const ConsensusTransactions: FC<ConsensusTransactionsProps> = ({
  isLoading,
  limit,
  pagination,
  transactions,
  ownAddress,
  verbose = true,
}) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'status', content: t('common.status') },
    { key: 'hash', content: t('common.hash') },
    { key: 'age', content: t('common.age') },
    { key: 'type', content: t('common.type') },
    ...(verbose ? [{ key: 'details', content: t('common.details') }] : []),
    { align: TableCellAlign.Right, key: 'value', content: t('common.amount') },
  ]

  const tableRows = transactions?.map(transaction => {
    return {
      key: `${transaction.hash}${transaction.index}`,
      data: [
        {
          content: <StatusIcon success={transaction.success} error={transaction.error} />,
          key: 'success',
        },
        {
          content: <TransactionLink scope={transaction} alwaysTrim hash={transaction.hash} />,
          key: 'hash',
        },
        {
          content: <Age sinceTimestamp={transaction.timestamp} />,
          key: 'timestamp',
        },
        {
          content: <ConsensusTransactionMethod method={transaction.method} truncate />,
          key: 'method',
        },
        ...(verbose
          ? [
              {
                content: <ConsensusTransactionDetails ownAddress={ownAddress} transaction={transaction} />,
                key: 'details',
              },
            ]
          : []),
        {
          align: TableCellAlign.Right,
          content: (
            <RoundedBalance
              value={transaction.body?.amount || transaction.body?.amount_change}
              ticker={transaction.ticker}
            />
          ),
          key: 'amount',
        },
      ],
      highlight: transaction.markAsNew,
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('transactions.latest')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
