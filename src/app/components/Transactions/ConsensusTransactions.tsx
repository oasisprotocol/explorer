import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Transaction } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoundedBalance } from '../../components/RoundedBalance'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusIcon } from '../StatusIcon'
import { TransactionLink } from './TransactionLink'
import { ConsensusTransactionMethod } from '../ConsensusTransactionMethod'
import { BlockLink } from '../Blocks/BlockLink'
import { ConsensusAmount } from './ConsensusAmount'
import { TransferIcon } from '../TransferIcon'
import { ConsensusAccountLink } from '../Account/ConsensusAccountLink'
import { TableHeaderAge } from '../TableHeaderAge'
import { TableCellAge } from '../TableCellAge'

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
  filtered: boolean
}

export const ConsensusTransactions: FC<ConsensusTransactionsProps> = ({
  isLoading,
  limit,
  pagination,
  transactions,
  ownAddress,
  verbose = true,
  filtered,
}) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'status', content: t('common.status') },
    { key: 'hash', content: t('common.hash') },
    { key: 'block', content: t('common.block') },
    { key: 'age', content: <TableHeaderAge />, align: TableCellAlign.Right },
    { key: 'type', content: t('common.type') },
    { key: 'from', content: t('common.from'), width: '150px' },
    ...(verbose
      ? [
          { key: 'to', content: t('common.to'), width: '150px' },
          { key: 'value', align: TableCellAlign.Right, content: t('common.amount'), width: '250px' },
        ]
      : []),
    { key: 'txnFee', content: t('common.fee'), align: TableCellAlign.Right, width: '250px' },
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
          content: <BlockLink scope={transaction} height={transaction.block} />,
          key: 'round',
        },
        {
          align: TableCellAlign.Right,
          content: <TableCellAge sinceTimestamp={transaction.timestamp} />,
          key: 'timestamp',
        },
        {
          content: <ConsensusTransactionMethod method={transaction.method} truncate />,
          key: 'type',
        },
        {
          align: TableCellAlign.Right,
          content: (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                justifyContent: 'space-between',
                pr: 3,
              }}
            >
              <ConsensusAccountLink
                labelOnly={!!ownAddress && transaction.sender === ownAddress}
                network={transaction.network}
                address={transaction.sender}
              />
              {verbose && transaction.to && <TransferIcon />}
            </Box>
          ),
          key: 'from',
        },
        ...(verbose
          ? [
              {
                content: transaction.to ? (
                  <ConsensusAccountLink
                    labelOnly={!!ownAddress && transaction.to === ownAddress}
                    network={transaction.network}
                    address={transaction.to}
                  />
                ) : null,
                key: 'to',
              },
              {
                align: TableCellAlign.Right,
                content: <ConsensusAmount transaction={transaction} />,
                key: 'value',
              },
            ]
          : []),
        {
          align: TableCellAlign.Right,
          content: <RoundedBalance value={transaction.fee} ticker={transaction.ticker} />,
          key: 'fee_amount',
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
      emptyMessage={filtered ? t('tableSearch.noMatchingResults') : t('account.emptyTransactionList')}
    />
  )
}
