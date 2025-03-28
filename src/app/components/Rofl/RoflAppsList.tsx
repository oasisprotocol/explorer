import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflApp } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '..//Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { TableHeaderAge } from '../TableHeaderAge'
import { RoflAppStatusBadge } from './RoflAppStatusBadge'
import { RoflAppLink } from './RoflAppLink'

type RoflAppsListProps = {
  apps?: RoflApp[]
  isLoading: boolean
  limit: number
  pagination: TablePaginationProps
}

export const RoflAppsList: FC<RoflAppsListProps> = ({ isLoading, limit, pagination, apps }) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'order', content: '' },
    { key: 'name', content: t('common.name') },
    { key: 'status', content: t('common.status') },
    { key: 'id', content: t('rofl.appId') },
    { key: 'instances', content: t('rofl.instances'), align: TableCellAlign.Right },
    { key: 'created', content: t('rofl.created'), align: TableCellAlign.Right },
    {
      key: 'lastActvity',
      content: <TableHeaderAge label={t('rofl.lastActvity')} />,
      align: TableCellAlign.Right,
    },
  ]
  const tableRows = apps?.map((app, index) => {
    return {
      key: app.id,
      data: [
        {
          content: index + 1 + (pagination.selectedPage - 1) * pagination.rowsPerPage,
          key: 'order',
        },
        {
          content: app.metadata?.name ? (
            <RoflAppLink id={app.id} name={app.metadata?.name} network={app.network} />
          ) : (
            t('rofl.nameNotProvided')
          ),
          key: 'name',
        },
        {
          content: (
            <RoflAppStatusBadge hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
          ),
          key: 'status',
        },
        {
          content: <RoflAppLink id={app.id} network={app.network} withSourceIndicator={false} />,
          key: 'id',
        },
        {
          align: TableCellAlign.Right,

          content: app.num_active_instances.toLocaleString(),
          key: 'instances',
        },
        {
          align: TableCellAlign.Right,
          content: t('common.formattedDateTime', {
            value: app.date_created,
            formatParams: {
              timestamp: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              } satisfies Intl.DateTimeFormatOptions,
            },
          }),
          key: 'firstActivity',
        },
        {
          align: TableCellAlign.Right,
          // TODO: Replace with last activity when available
          content: t('common.missing'),
          key: 'timestamp',
        },
      ],
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('rofl.listTitle')}
      isLoading={isLoading}
      pagination={pagination}
      emptyMessage={t('rofl.emptyRoflAppsList')}
    />
  )
}
