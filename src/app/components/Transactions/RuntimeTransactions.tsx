import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockIcon from '@mui/icons-material/Lock'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { StatusIcon } from '../StatusIcon'
import { RuntimeTransactionIcon } from '../../components/RuntimeTransactionLabel'
import { RoundedBalance } from '../../components/RoundedBalance'
import { RuntimeTransaction } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { TransactionLink } from './TransactionLink'
import { trimLongString } from '../../utils/trimLongString'
import Typography from '@mui/material/Typography'
import { doesAnyOfTheseLayersSupportEncryptedTransactions } from '../../../types/layers'
import { TransactionEncryptionStatus } from '../TransactionEncryptionStatus'
import { Age } from '../Age'

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
    { key: 'age', content: t('common.age'), align: TableCellAlign.Right },
    ...(verbose
      ? [
          { key: 'type', content: t('common.type'), align: TableCellAlign.Center },
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
      ...(verbose && canHaveEncryption
        ? [
            {
              content: <TransactionEncryptionStatus envelope={transaction.encryption_envelope} />,
              key: 'encrypted',
            },
          ]
        : []),
      {
        content: (
          <TransactionLink
            scope={transaction}
            alwaysTrim={true}
            hash={transaction.eth_hash || transaction.hash}
          />
        ),
        key: 'hash',
      },
      {
        content: <BlockLink scope={transaction} height={transaction.round} />,
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
              align: TableCellAlign.Center,
              content: <RuntimeTransactionIcon method={transaction.method} />,
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
                  {!!ownAddress &&
                  (transaction.sender_0_eth === ownAddress || transaction.sender_0 === ownAddress) ? (
                    <Typography
                      variant="mono"
                      component="span"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {trimLongString(transaction.sender_0_eth || transaction.sender_0)}
                    </Typography>
                  ) : (
                    <AccountLink
                      scope={transaction}
                      address={transaction.sender_0_eth || transaction.sender_0}
                      alwaysTrim={true}
                    />
                  )}
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
              content:
                !!ownAddress && (transaction.to_eth === ownAddress || transaction.to === ownAddress) ? (
                  <Typography
                    variant="mono"
                    component="span"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {trimLongString(transaction.to_eth || transaction.to!)}
                  </Typography>
                ) : (
                  <AccountLink
                    scope={transaction}
                    address={transaction.to_eth || transaction.to!}
                    alwaysTrim={true}
                  />
                ),
              key: 'to',
            },
            {
              align: TableCellAlign.Right,
              content: <RoundedBalance value={transaction.charged_fee} ticker={transaction.ticker} />,
              key: 'fee_amount',
            },
            {
              align: TableCellAlign.Right,
              content: <RoundedBalance value={transaction.amount} ticker={transaction.ticker} />,
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
