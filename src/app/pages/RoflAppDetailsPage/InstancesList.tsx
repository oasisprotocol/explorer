import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { RoflInstance } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { RoflAppInstanceStatusBadge } from 'app/components/Rofl/RoflAppInstanceStatusBadge'

type InstancesListProps = {
  currentEpoch: number | undefined
  instances: RoflInstance[] | undefined
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const InstancesList: FC<InstancesListProps> = ({
  isLoading,
  limit,
  pagination,
  instances,
  currentEpoch,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rak', content: t('rofl.rakAbbreviation') },
    { key: 'node', content: t('rofl.nodeId') },
    { key: 'expirationEpoch', content: t('rofl.expirationEpoch'), align: TableCellAlign.Right },
    { key: 'expirationStatus', content: t('common.status'), align: TableCellAlign.Right },
  ]

  const tableRows =
    currentEpoch !== undefined && instances
      ? instances?.map(instance => {
          return {
            key: instance.rak,
            data: [
              {
                key: 'rak',
                content: <Typography variant="mono">{instance.rak}</Typography>,
              },
              {
                key: 'node',
                content: <Typography variant="mono">{instance.endorsing_node_id}</Typography>,
              },
              {
                key: 'expirationEpoch',
                content: instance.expiration_epoch.toLocaleString(),
                align: TableCellAlign.Right,
              },
              {
                key: 'expirationStatus',
                content: <RoflAppInstanceStatusBadge isActive={instance.expiration_epoch > currentEpoch} />,
                align: TableCellAlign.Right,
              },
            ],
          }
        })
      : undefined

  return (
    <Table
      emptyMessage={t('rofl.emptyInstancesList')}
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('rofl.instances')}
      isLoading={isLoading}
      pagination={pagination}
      extraHorizontalSpaceOnMobile
    />
  )
}
