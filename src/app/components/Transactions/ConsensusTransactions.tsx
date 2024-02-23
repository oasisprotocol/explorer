import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Transaction } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoundedBalance } from '../../components/RoundedBalance'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { StatusIcon } from '../StatusIcon'
import { Age } from '../Age'
import { TransactionLink } from './TransactionLink'
import { ConsensusTransactionMethod } from '../ConsensusTransactionMethod'

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
  verbose = true,
}) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'status', content: t('common.status') },
    { key: 'hash', content: t('common.hash') },
    { key: 'block', content: t('common.block') },
    { key: 'age', content: t('common.age') },
    ...(verbose
      ? [
          { key: 'method', content: t('common.method') },
          { key: 'from', content: t('common.from'), width: '150px' },
          { key: 'to', content: t('common.to'), width: '150px' },
          { key: 'txnFee', content: t('common.transactionFee'), align: TableCellAlign.Right, width: '250px' },
          { key: 'value', align: TableCellAlign.Right, content: t('common.value'), width: '250px' },
        ]
      : []),
  ]
  const tableRows = transactions?.map(transaction => ({
    key: transaction.hash,
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
        content: <BlockLink scope={transaction} height={transaction.block} />,
        key: 'round',
      },
      {
        content: <Age sinceTimestamp={transaction.timestamp} />,
        key: 'timestamp',
      },
      ...(verbose
        ? [
            {
              content: <ConsensusTransactionMethod method={transaction.method} truncate />,
              key: 'method',
            },
            {
              align: TableCellAlign.Right,
              content: (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    pr: 3,
                  }}
                >
                  <AccountLink scope={transaction} address={transaction.sender} alwaysTrim />
                </Box>
              ),
              key: 'from',
            },
            {
              // TODO: show recipients address when props is added to API
              content: <>-</>,
              key: 'to',
            },
            {
              align: TableCellAlign.Right,
              content: <RoundedBalance value={transaction.fee} ticker={transaction.ticker} />,
              key: 'fee_amount',
            },
            {
              align: TableCellAlign.Right,
              // TODO: show RoundedBalance when API returns amount prop
              content: <>-</>,
              key: 'value',
            },
          ]
        : []),
    ],
    highlight: transaction.markAsNew,
  }))

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
