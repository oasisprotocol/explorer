import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Transaction } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoundedBalance } from '../../components/RoundedBalance'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusIcon } from '../StatusIcon'
import { Age } from '../Age'
import { TransactionLink } from './TransactionLink'
import { ConsensusTransactionMethod } from '../ConsensusTransactionMethod'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { ConsensusAmount } from './ConsensusAmount'

const iconSize = '28px'
const StyledCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: iconSize,
  height: iconSize,
  color: COLORS.eucalyptus,
  backgroundColor: COLORS.lightGreen,
  borderRadius: iconSize,
  marginLeft: theme.spacing(3),
  marginRight: `-${theme.spacing(4)}`,
}))

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
    { key: 'block', content: t('common.block') },
    { key: 'age', content: t('common.age'), align: TableCellAlign.Right },
    ...(verbose
      ? [
          { key: 'type', content: t('common.type') },
          { key: 'from', content: t('common.from'), width: '150px' },
          { key: 'to', content: t('common.to'), width: '150px' },
          { key: 'value', align: TableCellAlign.Right, content: t('common.amount'), width: '250px' },
          { key: 'txnFee', content: t('common.fee'), align: TableCellAlign.Right, width: '250px' },
        ]
      : []),
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
          content: <Age sinceTimestamp={transaction.timestamp} />,
          key: 'timestamp',
        },
        ...(verbose
          ? [
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
                      pr: 3,
                    }}
                  >
                    <AccountLink
                      labelOnly={!!ownAddress && transaction.sender === ownAddress}
                      scope={transaction}
                      address={transaction.sender}
                      alwaysTrim
                    />
                    {transaction.to && (
                      <StyledCircle>
                        <ArrowForwardIcon fontSize="inherit" />
                      </StyledCircle>
                    )}
                  </Box>
                ),
                key: 'from',
              },
              {
                content: transaction.to ? (
                  <AccountLink
                    labelOnly={!!ownAddress && transaction.to === ownAddress}
                    scope={transaction}
                    address={transaction.to}
                    alwaysTrim
                  />
                ) : null,
                key: 'to',
              },
              {
                align: TableCellAlign.Right,
                content: <ConsensusAmount transaction={transaction} />,
                key: 'value',
              },
              {
                align: TableCellAlign.Right,
                content: <RoundedBalance value={transaction.fee} ticker={transaction.ticker} />,
                key: 'fee_amount',
              },
            ]
          : []),
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
