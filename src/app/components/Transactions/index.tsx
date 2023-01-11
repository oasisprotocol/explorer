import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { TransactionStatusIcon } from '../../components/TransactionStatusIcon'
import { RuntimeTransactionLabel } from '../../components/RuntimeTransactionLabel'
import { TrimLinkLabel } from '../../components/TrimLinkLabel'
import { RuntimeTransaction } from '../../../oasis-indexer/generated/api'
import ArrowIcon, { ArrowDirection } from '../../icons/ArrowIcon'
import { COLORS } from '../../../styles/theme/colors'
import { emeraldRoute } from '../../../routes'

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

type TransactionProps = {
  isLoading: boolean
  limit: number
  pagination?: boolean
  transactions?: TableRuntimeTransaction[]
}

export const Transactions: FC<TransactionProps> = ({ isLoading, limit, pagination = true, transactions }) => {
  const { t } = useTranslation()
  const tableColumns = [
    { content: t('common.status') },
    { content: t('common.hash') },
    { content: t('common.block') },
    { content: t('common.age') },
    { content: t('common.type') },
    { content: t('common.from'), width: '150px' },
    { content: t('common.to'), width: '150px' },
    { content: t('common.txnFee') },
    { align: TableCellAlign.Right, content: t('common.value') },
  ]
  const tableRows = transactions?.map(transaction => ({
    key: transaction.hash!,
    data: [
      {
        content: <TransactionStatusIcon success={transaction.success!} />,
        key: 'success',
      },
      {
        content: <TrimLinkLabel label={transaction.hash!} to="transaction" />,

        key: 'hash',
      },
      {
        content: (
          <Link
            component={RouterLink}
            to={`${emeraldRoute}/blocks/${encodeURIComponent(transaction.round!)}`}
          >
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
            <TrimLinkLabel
              label={transaction.sender_0!}
              to={`${emeraldRoute}/account/${transaction.sender_0}`}
            />
            <StyledCircle>
              <ArrowIcon arrowDirection={ArrowDirection.RIGHT} />
            </StyledCircle>
          </Box>
        ),

        key: 'from',
      },
      {
        content: <TrimLinkLabel label={transaction.to!} to={`${emeraldRoute}/account/${transaction.to!}`} />,
        key: 'to',
      },
      {
        align: TableCellAlign.Right,
        content: t('common.valueInRose', { value: transaction.fee_amount }),
        key: 'fee_amount',
      },
      {
        align: TableCellAlign.Right,
        content: t('common.valueInRose', { value: transaction.amount }),
        key: 'value',
      },
    ],
    markAsNew: transaction.markAsNew,
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
