import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DebondingDelegation } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { RoundedBalance } from '../RoundedBalance'
import { AccountLink } from '../Account/AccountLink'

type DelegationsProps = {
  debondingDelegations?: DebondingDelegation[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const Delegations: FC<DelegationsProps> = ({ debondingDelegations, isLoading, limit, pagination }) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'delegator', content: t('common.address') },
    { key: 'amount', content: t('validator.amount'), align: TableCellAlign.Right },
    { key: 'shares', content: t('validator.shares'), align: TableCellAlign.Right },
    { key: 'debondingEnd', content: t('validator.debondingEnd'), align: TableCellAlign.Right },
  ]
  const tableRows = debondingDelegations?.map(delegation => ({
    key: delegation.delegator,
    data: [
      {
        content: <AccountLink scope={delegation} address={delegation.delegator} />,
        key: 'delegator',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={delegation.amount} ticker={delegation.ticker} />,
        key: 'amount',
      },

      {
        align: TableCellAlign.Right,
        // TODO: Add when API returns correct value
        content: <>-</>,
        key: 'shares',
      },
      {
        align: TableCellAlign.Right,
        // TODO: Add when API returns correct value and provides current epoch
        content: <>-</>,
        key: 'debondingEnd',
      },
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('validator.undelegations')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
