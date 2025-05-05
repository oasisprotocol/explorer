import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflApp } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { TableHeaderAge } from '../TableHeaderAge'
import { TableCellAge } from '../TableCellAge'
import { RoflAppStatusBadge } from './RoflAppStatusBadge'
import { RoflAppLink } from './RoflAppLink'

type RoflAppsListProps = {
  apps?: RoflApp[]
  isLoading: boolean
  limit: number
  pagination: TablePaginationProps | false
}

export const RoflAppsList: FC<RoflAppsListProps> = ({ isLoading, limit, pagination, apps }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()

  const tableColumns: TableColProps[] = [
    { key: 'order', content: '' },
    { key: 'name', content: t('common.name') },
    { key: 'status', content: t('common.status') },
    { key: 'id', content: t('rofl.appId') },
    {
      key: 'instances',
      content: isTablet ? t('rofl.replicas') : t('rofl.activeReplicas'),
      align: TableCellAlign.Right,
    },
    { key: 'created', content: t('rofl.created'), align: TableCellAlign.Right },
    {
      key: 'lastActivity',
      content: <TableHeaderAge label={t('rofl.lastActivity')} />,
      align: TableCellAlign.Right,
    },
  ]
  const tableRows = apps?.map((app, index) => {
    return {
      key: app.id,
      data: [
        {
          content: pagination
            ? index + 1 + (pagination.selectedPage - 1) * pagination.rowsPerPage
            : // views without pagination enabled
              index + 1,
          key: 'order',
        },
        {
          content: app?.metadata['net.oasis.rofl.name'] ? (
            <RoflAppLink id={app.id} name={app?.metadata['net.oasis.rofl.name']} network={app.network} />
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
            timestamp: new Date(app.date_created),
            formatParams: {
              timestamp: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              } satisfies Intl.DateTimeFormatOptions,
            },
          }),
          key: 'created',
        },
        {
          align: TableCellAlign.Right,
          content: app.last_activity ? (
            <TableCellAge sinceTimestamp={app.last_activity} />
          ) : (
            t('common.missing')
          ),
          key: 'lastActivity',
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
