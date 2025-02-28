import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoflApp } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { Age } from '../Age'
import { AppStatus } from './AppStatus'

type TableRoflApps = RoflApp & {
  markAsNew?: boolean
}

export type TableRoflAppsList = {
  rofl_apps: TableRoflApps[]
  total_count: number
  is_total_count_clipped: boolean
}

type RoflAppsListProps = {
  apps?: any[]
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
    { key: 'firstActivity', content: t('rofl.firstActivity'), align: TableCellAlign.Right },
    { key: 'timestamp', content: t('rofl.activity'), align: TableCellAlign.Right },
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
          content: app.metadata?.name || t('common.missing'),
          key: 'name',
        },
        {
          content: <AppStatus status={app.status} />,
          key: 'status',
        },
        {
          content: app.id,
          key: 'id',
        },
        {
          align: TableCellAlign.Right,
          content: app.instances?.length?.toLocaleString() || 0,
          key: 'instances',
        },
        {
          align: TableCellAlign.Right,
          content: t('common.formattedDateTime', {
            value: app.first_activity,
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
          content: <Age sinceTimestamp={app.timestamp} />,
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
