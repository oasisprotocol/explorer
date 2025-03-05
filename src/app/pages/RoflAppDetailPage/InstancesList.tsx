import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../../components/Table/TablePagination'

type InstancesListProps = {
  instances: any[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const InstancesList: FC<InstancesListProps> = ({ isLoading, limit, pagination, instances }) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rak', content: t('rofl.rak') },
    { key: 'node', content: t('rofl.node') },
    { key: 'expiration', content: t('rofl.expiration'), align: TableCellAlign.Right },
  ]

  const tableRows = instances?.map(instance => {
    return {
      key: instance.rak,
      data: [
        {
          key: 'rak',
          content: instance.rak,
        },
        {
          key: 'node',
          content: instance.node,
        },
        {
          key: 'expiration',
          content: t('common.formattedDateTime', {
            value: instance.timestamp,
            formatParams: {
              timestamp: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              } satisfies Intl.DateTimeFormatOptions,
            },
          }),
          align: TableCellAlign.Right,
        },
      ],
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
      extraHorizontalSpaceOnMobile
    />
  )
}
