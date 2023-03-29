import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Box from '@mui/material/Box'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { RoundedRoseBalance } from '../../components/RoundedBalance'
import { RuntimeTransaction } from '../../../oasis-indexer/api'
import { COLORS } from '../../../styles/theme/colors'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { TransactionLink } from './TransactionLink'
import { trimLongString } from '../../utils/trimLongString'
import Typography from '@mui/material/Typography'

const StyledCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: `-${theme.spacing(5)}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  color: COLORS.eucalyptus,
  backgroundColor: COLORS.lightGreen,
  borderRadius: theme.spacing(5),
  margin: theme.spacing(3),
}))

type TableRuntimeTransaction = RuntimeTransaction & {
  markAsNew?: boolean
}

export type TableRuntimeTransactionList = {
  transactions: TableRuntimeTransaction[]
  total_count: number
  is_total_count_clipped: boolean
}

type TransactionProps = {
  transactions?: TableRuntimeTransaction[]
  ownAddress?: string
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  verbose?: boolean
}

export const Transactions: FC<TransactionProps> = ({
  isLoading,
  limit,
  pagination,
  transactions,
  ownAddress,
  verbose = true,
}) => {
  const { t } = useTranslation()
  const tableColumns = [
    { content: t('common.status') },
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
      {
        content: (
          <TransactionLink
            alwaysTrim={true}
            layer={transaction.layer}
            hash={transaction.eth_hash || transaction.hash}
          />
        ),
        key: 'hash',
      },
      ...(verbose
        ? [
            {
              content: <BlockLink layer={transaction.layer} height={transaction.round} />,
              key: 'round',
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: formatDistanceStrict(new Date(transaction.timestamp), new Date(), {
          addSuffix: true,
        }),
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
              pr: 4,
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
                address={transaction.sender_0_eth || transaction.sender_0}
                layer={transaction.layer}
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
              address={transaction.to_eth || transaction.to!}
              layer={transaction.layer}
              alwaysTrim={true}
            />
          ),
        key: 'to',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedRoseBalance value={transaction.fee} />,
        key: 'fee_amount',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedRoseBalance value={transaction.amount} />,
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
