import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { RoflApp } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { StatusBadge } from './AppStatus'

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
    { key: 'active', content: t('common.status') },
    { key: 'id', content: t('rofl.appId') },
    { key: 'tee', content: t('rofl.tee'), align: TableCellAlign.Right },
    { key: 'instances', content: t('rofl.instances'), align: TableCellAlign.Right },
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
          content: app.metadata?.name,
          key: 'name',
        },
        {
          content: <StatusBadge active={app.active} />,
          key: 'active',
        },
        {
          content: app.id,
          key: 'id',
        },
        {
          align: TableCellAlign.Right,
          content: 'TDX/SGX',
          key: 'tee',
        },
        {
          align: TableCellAlign.Right,
          content: app.instances?.length?.toLocaleString(),
          key: 'instances',
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
