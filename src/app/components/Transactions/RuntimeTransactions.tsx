import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import LockIcon from '@mui/icons-material/Lock'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { StatusIcon } from '../StatusIcon'
import { RuntimeTransactionMethod } from '../../components/RuntimeTransactionMethod'
import { RoundedBalance } from '../../components/RoundedBalance'
import { RuntimeTransaction } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { TransactionLink } from './TransactionLink'
import { doesAnyOfTheseLayersSupportEncryptedTransactions } from '../../../types/layers'
import { TransactionEncryptionStatus } from '../TransactionEncryptionStatus'
import { TransferIcon } from '../TransferIcon'
import { TableHeaderAge } from '../TableHeaderAge'
import { TableCellAge } from '../TableCellAge'

type TableRuntimeTransaction = RuntimeTransaction & {
  markAsNew?: boolean
}

export type TableRuntimeTransactionList = {
  transactions: TableRuntimeTransaction[]
  total_count: number
  is_total_count_clipped: boolean
}

type TransactionsProps = {
  transactions?: TableRuntimeTransaction[]
  ownAddress?: string
  isLoading: boolean
  filtered: boolean
  limit: number
  pagination: false | TablePaginationProps
  verbose?: boolean
}

export const RuntimeTransactions: FC<TransactionsProps> = ({
  isLoading,
  limit,
  pagination,
  transactions,
  ownAddress,
  verbose = true,
  filtered,
}) => {
  const { t } = useTranslation()
  // We only want to show encryption status of we are listing transactions
  // from paratimes that actually support encrypting transactions
  const canHaveEncryption = doesAnyOfTheseLayersSupportEncryptedTransactions(
    transactions?.map(tx => tx.layer),
  )
  const tableColumns: TableColProps[] = [
    { key: 'status', content: t('common.status') },
    ...(verbose && canHaveEncryption
      ? [{ key: 'encrypted', content: <LockIcon htmlColor={COLORS.grayMedium} /> }]
      : []),
    { key: 'hash', content: t('common.hash') },
    { key: 'block', content: t('common.block') },
    { key: 'age', content: <TableHeaderAge />, align: TableCellAlign.Right },
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
    const targetAddress = transaction.to_eth || transaction.to
    return {
      key: `${transaction.hash}${transaction.index}`,
      data: [
        {
          content: (
            <StatusIcon success={transaction.success} error={transaction.error} method={transaction.method} />
          ),
          key: 'success',
        },
        ...(verbose && canHaveEncryption
          ? [
              {
                content: (
                  <TransactionEncryptionStatus
                    envelope={transaction.encryption_envelope ?? transaction.oasis_encryption_envelope}
                  />
                ),
                key: 'encrypted',
              },
            ]
          : []),
        {
          content: (
            <TransactionLink scope={transaction} alwaysTrim hash={transaction.eth_hash || transaction.hash} />
          ),
          key: 'hash',
        },
        {
          content: <BlockLink scope={transaction} height={transaction.round} />,
          key: 'round',
        },
        {
          align: TableCellAlign.Right,
          content: <TableCellAge sinceTimestamp={transaction.timestamp} />,
          key: 'timestamp',
        },
        ...(verbose
          ? [
              {
                content: <RuntimeTransactionMethod transaction={transaction} truncate />,
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
                    <AccountLink
                      labelOnly={
                        !!ownAddress &&
                        (transaction.signers[0].address_eth === ownAddress ||
                          transaction.signers[0].address === ownAddress)
                      }
                      scope={transaction}
                      address={transaction.signers[0].address_eth ?? transaction.signers[0].address}
                      alwaysTrim
                    />
                    {targetAddress && <TransferIcon />}
                  </Box>
                ),
                key: 'from',
              },
              {
                content: targetAddress ? (
                  <AccountLink
                    labelOnly={
                      !!ownAddress && (transaction.to_eth === ownAddress || transaction.to === ownAddress)
                    }
                    scope={transaction}
                    address={targetAddress}
                    alwaysTrim
                  />
                ) : null,
                key: 'to',
              },
              {
                align: TableCellAlign.Right,
                content:
                  transaction.amount && transaction.amount !== '0' ? (
                    <RoundedBalance value={transaction.amount} ticker={transaction.amount_symbol} />
                  ) : (
                    <RoundedBalance
                      compactLargeNumbers
                      value={transaction?.body?.shares}
                      ticker={t('common.shares')}
                    />
                  ),
                key: 'value',
              },
              {
                align: TableCellAlign.Right,
                content: <RoundedBalance value={transaction.charged_fee} ticker={transaction.fee_symbol} />,
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
      emptyMessage={filtered ? t('tableSearch.noMatchingResults') : t('account.emptyTransactionList')}
    />
  )
}
