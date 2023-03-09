import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { TrimLinkLabel } from '../../components/TrimLinkLabel'
import { RoundedRoseBalance } from '../../components/RoundedBalance'
import { RuntimeTransaction } from '../../../oasis-indexer/api'
import { COLORS } from '../../../styles/theme/colors'
import { RouteUtils } from '../../utils/route-utils'
import { Layer } from '../../../config'
import { TablePaginationProps } from '../Table/TablePagination'

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
}

type TransactionProps = {
  transactions?: TableRuntimeTransaction[]
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
          <Typography variant="mono">
            <TrimLinkLabel
              label={transaction.hash}
              to={RouteUtils.getTransactionRoute(transaction.hash, Layer.Emerald)}
            />
          </Typography>
        ),
        key: 'hash',
      },
      ...(verbose
        ? [
            {
              content: (
                <Typography variant="mono">
                  <Link
                    component={RouterLink}
                    to={RouteUtils.getBlockRoute(transaction.round, Layer.Emerald)}
                  >
                    {transaction.round.toLocaleString()}
                  </Link>
                </Typography>
              ),
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
            <Typography variant="mono">
              <TrimLinkLabel
                label={transaction.sender_0}
                to={RouteUtils.getAccountRoute(transaction.sender_0, Layer.Emerald)}
              />
            </Typography>
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
        content: (
          <Typography variant="mono">
            <TrimLinkLabel
              label={transaction.to!}
              to={RouteUtils.getAccountRoute(transaction.to!, Layer.Emerald)}
            />
          </Typography>
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
