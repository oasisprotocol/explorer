import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { Delegation } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { RoundedBalance } from '../RoundedBalance'

type DelegationsProps = {
  delegations?: Delegation[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const Delegations: FC<DelegationsProps> = ({ delegations, isLoading, limit, pagination }) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'name', content: t('validator.title') },
    { align: TableCellAlign.Right, key: 'shares', content: t('validator.shares') },
    { align: TableCellAlign.Right, key: 'staked', content: t('common.staked') },
  ]
  const tableRows = delegations?.map(delegation => ({
    key: delegation.validator,
    data: [
      {
        // TODO: Enable link with trimmed label when validator details page #1232 is merged
        // TODO: Use trimmed name when API is updated
        content: <>{delegation.validator}</>,
        key: 'name',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={delegation.shares} />,
        key: 'shares',
      },
      {
        align: TableCellAlign.Right,

        content: <RoundedBalance value={delegation.amount} ticker={delegation.ticker} />,
        key: 'staked',
      },
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('common.staking')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
