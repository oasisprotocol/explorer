import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockIcon from '@mui/icons-material/Lock'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { RoundedBalance } from '../../components/RoundedBalance'
import { RuntimeTransaction } from '../../../oasis-indexer/api'
import { COLORS } from '../../../styles/theme/colors'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { TransactionLink } from './TransactionLink'
import { trimLongString } from '../../utils/trimLongString'
import Typography from '@mui/material/Typography'
import { doesAnyOfTheseLayersSupportEncryptedTransactions } from '../../../types/layers'
import { TransactionEncryptionStatus } from '../TransactionEncryptionStatus'
import { formatDistanceStrict } from '../../utils/dateFormatter'

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

export const Transactions: FC<TransactionsProps> = ({
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
  const tableColumns = [
    { content: t('common.status') },
    ...(canHaveEncryption
      ? [{ content: (<LockIcon htmlColor={COLORS.grayMedium} />) as unknown as string }]
      : []), // The table does support widgets in the column headers, but the TS definition is unaware of that.
    { content: t('common.hash') },
    ...(verbose ? [{ content: t('common.block') }] : []),
    { content: t('common.age'), align: TableCellAlign.Right },
    { content: t('common.type') },
    { content: t('common.from'), width: '150px' },
    { content: t('common.to'), width: '150px' },
    { content: t('common.txnFee'), align: TableCellAlign.Right, width: '250px' },
    { align: TableCellAlign.Right, content: t('common.value'), width: '250px' },
  ]
  const tableRows = transactions?.map(transaction => ({
    key: transaction.hash,
    data: [
      {
        content: <TransactionStatusIcon success={transaction.success} />,
        key: 'success',
      },
      ...(canHaveEncryption
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
      ...(verbose
        ? [
            {
              content: <BlockLink scope={transaction} height={transaction.round} />,
              key: 'round',
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: formatDistanceStrict(new Date(transaction.timestamp), new Date()),
        key: 'timestamp',
      },
      {
        content: <RuntimeTransactionLabel method={transaction.method} />,
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
        content: <RoundedBalance value={transaction.fee} ticker={transaction.ticker} />,
        key: 'fee_amount',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={transaction.amount} ticker={transaction.ticker} />,
        key: 'value',
      },
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
