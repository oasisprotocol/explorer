import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoundedBalance } from '../../components/RoundedBalance'
import { Account } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { AccountSizeBadge } from '../AccountSizeBadge'

type AccountListProps = {
  accounts?: Account[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  verbose?: boolean
}

export const AccountList: FC<AccountListProps> = ({ isLoading, limit, pagination, accounts, verbose }) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { align: TableCellAlign.Center, key: 'size', content: t('common.size') },
    { key: 'address', content: t('common.address') },
    { align: TableCellAlign.Right, key: 'available', content: t('account.available') },
    { align: TableCellAlign.Right, key: 'staked', content: t('common.staked') },
    { align: TableCellAlign.Right, key: 'debonding', content: t('account.debonding') },
    { align: TableCellAlign.Right, key: 'total', content: <strong>{t('account.totalBalance')}</strong> },
  ]
  const tableRows = accounts?.map(account => ({
    key: account.address,
    data: [
      {
        content: (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <AccountSizeBadge size={account.size} />
          </Box>
        ),
        key: 'size',
      },
      {
        content: <AccountLink scope={account} address={account.address} alwaysTrim />,
        key: 'address',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={account.available} ticker={account.ticker} />,
        key: 'available',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <>
            {account.delegations_balance &&
              t('common.valueInToken', {
                ...getPreciseNumberFormat(account.delegations_balance),
                ticker: account.ticker,
              })}
          </>
        ),
        key: 'staked',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <>
            {account.debonding_delegations_balance &&
              t('common.valueInToken', {
                ...getPreciseNumberFormat(account.debonding_delegations_balance),
                ticker: account.ticker,
              })}
          </>
        ),
        key: 'debonding',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <strong>
            <RoundedBalance value={account.total} ticker={account.ticker} />
          </strong>
        ),
        key: 'total',
      },
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('account.listTitle')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
